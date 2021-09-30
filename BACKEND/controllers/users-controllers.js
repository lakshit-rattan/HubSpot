const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Lakshit Rattan",
    email: "test@test.com",
    password: "Yolo@123",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError(
      "Invalid Inputs passed, please check your data again.",
      422,
    ); // 422 -> invalid input status code
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exists", 422); //422 -> Status code for invalid user input
  }

  const createdUser = {
    id: uuidv4(),
    name, //JS shortcut syntax. just means =>  name:name
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  //Just dummy validation below to check if we have email and password associated with the entered one in the body

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seems to be wrong",
      401,
    ); //401 -> Status code for authentication failure
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
