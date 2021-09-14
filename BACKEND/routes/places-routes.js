const express = require("express");
//Wherever we wish to use express, we HAVE to import the express library from node modules.

//using a special function called router in express
const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous Sky-Scrapers in the World",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

//setting the GET method for the '/' path for the router const
//We actually now want to have a GET request, where the ID is part of the URL. the idea is that we send the request to the API '/places/p1' for eg, and that gives us the data for the place for the ID p1
//So the ID should be endcoded in the URL(Dynamic ID). To tell express that we have a dynamic segment (which we don't know in advance), we add a colon(:) in our filter and then any identifier of our choice, which is then identified by EXPRESS as a dynammic id and works fine
//So now, as we know how to succesfully enter into this pid target, we now want to return the place associated with that pid from the database/duummy data
/**
 * For that, we need to first get the value that is entered into the dynamic pid compare the value with the values present in the Database/dummy data, and the return the necessary data
 * ExpressJS covers this too. we get the pid by using the 'Request' object and there we will have a 'params' property  
 * 'params' -> this property is added by ExpressJS, which in the end, holds an object, where our dynamic segments are stored as KEYS, and it's values, will be the values entered by the user in place of that dynamic segment. eg- {pid:'p1'}
*/ 
router.get("/:pid", (req, res, next) => {
  const placeid = req.params.pid;
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeid;
  });
  console.log("GET Request in Places");
  //this is a special method, which sends back a JSON response to wherever it is imported, and whatever written in the json, is parsed accordingly
  res.json({place}); // ==> {place} = {place:place} automatically. JS 
});

//Exporting the const named router. this is the general syntax for exporting.
module.exports = router;
