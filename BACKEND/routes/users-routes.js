const express = require("express");

//Express validator package to validate the user input.
//Alternative -> const validator = require('express-validator'); to import the entire functinality of express-validator into the validator const, but here, as we just need the check functionality, hence we will use object destructuring to fetch just the check function from it
const { check } = require("express-validator");
//check method is a function we can execute and it will return a new middleware configured for our validation requirements

const HttpError = require("../models/http-error");

const userControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", userControllers.getUsers);

router.post(
  "/signup",
  //this is how we use the multer middleware. access the single method inside the fileUpload function, and in the argument, the name of the to-be-expected incoming body request, that will hold the image or file that is to be extracted
  //We basically expect an "image" key on the incoming request which should hold the image that we want to extract
  fileUpload.single('image'),
  //but what will multer do with that ? we have to store that image file somewhere, and we tell that to multer in the file-upload.js file
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), //Test@test.com => test@test.com
    check("password").isStrongPassword(),
  ],
  userControllers.signup,
);

router.post("/login", userControllers.login);

module.exports = router;
