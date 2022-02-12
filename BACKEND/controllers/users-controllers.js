const { validationResult } = require("express-validator");
//for hashing and passwords and storing them in a hashed manner
const bcrypt = require("bcryptjs");
//for token generation
const jwt = require("jsonwebtoken");

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

  const { name, email, password } = req.body;

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

  //for hashing the entered password using bcryptjs module
  let hashedPassword;
  //hash function takes 2 arguments, the variable of which we want ot hash, i.e the passowrd variable,
  //and the 2nd argument it takes is the number of "SALTING ROUNDS". Here 12 is good value and it simply influences
  //the strength of the hash and how easy or hard it is to reverse engineer it. with 12 salting rounds, we have
  //which can't be reverse engineered but also which won't take hours to generate a hash. it also returns a promise
  //so we will put the 'await' before it
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create the user, Please try again later.",
      500,
    );
    return next(error);
  }

  const createdUser = new User({
    name, //JS shortcut syntax. just means =>  name:name
    email,
    image: req.file.path,
    //storing the password as it is for now. Will enhance security by encrytion during file upload stages
    password: hashedPassword,
    places: [],
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

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" },
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Please try again later.",
      500,
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!existingUser) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in",
      403,
    );
    return next(error);
  }

  //if we do find if the user exists, then we go ahead and check if the password exists

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500,
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in",
      403,
    );
    return next(error);
  }

  //token generation

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      //NOTE - use same secret key for login and signup, because otherwise the server would create confusion in validating the login and signup tokens.
      "supersecret_dont_share",
      { expiresIn: "1h" },
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed. Please try again later.",
      500,
    );
    return next(error);
  }

  //IF we do get past the authentication logic, for now we'll just display a message -> Logged in

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
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
