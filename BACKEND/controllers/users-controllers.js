const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");


const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password"); //inside the find, is a special notation which is basically saying that, except for the password field, return all the fields of the of the found element from the DB
// we can also do this like -> users = await User.find({}, "name email");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed. Please try again later.",
      500,
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError(
        "Invalid Inputs passed, please check your data again.",
        422,
      ),
    ); // 422 -> invalid input status code
  }

  const { name, email, password} = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing Up Failed. Please try again later.",
      500,
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please Log-In instead.",
      422,
    );
    return next(error);
  }

  const createdUser = new User({
    name, //JS shortcut syntax. just means =>  name:name
    email,
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    //storing the password as it is for now. Will enhance security by encrytion during file upload stages
    password,
    places:[]
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Please try again later.",
      500,
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //Just dummy validation below to check if we have email and password associated with the entered one in the body

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed. Please try again later.",
      500,
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in",
      401,
    );
    return next(error);
  }

  //IF we do get past the authentication logic, for now we'll just display a message -> Logged in

  res.json({ message: "Logged in !" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

/** User input validation is a very important concept that is required
 * while developing websites. what we need is a well structured validation
 * for the input.
 * For that, we will use a 3rd party library called 'Express Validator'
 * although we can do stuff by putting various if else checks, the process
 * would become very lengthy and cumbersome and a much better logic is necessary
 * this 3rd part library gives us various middlewares that we can register to run
 * various validations on the incoming data
 *
 */
