const express = require("express");
//Wherever we wish to use express, we HAVE to import the express library from node modules.

//using a special function called router in express
const router = express.Router();


//setting the GET method for the '/' path for the router const
router.get("/", (req, res, next) => {
  console.log("GET Request in Places");
  //this is a special method, which sends back a JSON response to wherever it is imported, and whatever written in the json, is parsed accordingly
  res.json({ message: "It Works fine !" });
});

//Exporting the const named router. this is the general syntax for exporting.
module.exports = router;
