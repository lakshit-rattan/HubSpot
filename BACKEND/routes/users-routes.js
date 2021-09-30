const express = require("express");

//Express validator package to validate the user input.
//Alternative -> const validator = require('express-validator'); to import the entire functinality of express-validator into the validator const, but here, as we just need the check functionality, hence we will use object destructuring to fetch just the check function from it
const { check } = require("express-validator");
//check method is a function we can execute and it will return a new middleware configured for our validation requirements

const HttpError = require("../models/http-error");

const userControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", userControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isStrongPassword(),
  ],
  userControllers.signup,
);

router.post(
  "/login",
  userControllers.login,
);

module.exports = router;
