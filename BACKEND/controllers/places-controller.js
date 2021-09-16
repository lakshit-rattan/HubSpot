const HttpError = require("../models/http-error");


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

/**  the idea is that in this file, we have all the middleware functions which actually are reached for certain routes
 * so we will cut all the middleware functions from the different requests in places-routes.js file and paste them here.
 * here we will paste the middleware functions into a new function declaration or function expression (arrow function)
 * No doubt that this file will now keep getting bigger, but the focus of this file will be simply concentrated to the
 * middleware logic behind the different routes, which is the whole idea behind the concept of controllers.
 * This just leaves the places-route.js file to just handle the routing, mapping paths and HTTP methods to controllers
 * leaving the entire logic behind them to the controllers
 *
 * As we now will just be interacting with all the logic of the data in this file, our dummy array will also be placed here from places-routes.js file
 *
 * we don't need to import express here, because we are not using any feature of express here
 * */

const getPlaceById = (req, res, next) => {
  const placeid = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeid;
  });

  // if place undefined then send a 404 response status
  // for that, we use the status function and json method to send a response message
  /**now here we just introduced a bug in the system. Now considering that this 404 status message is printed, the compiler WILL not stop here.
   * Instead, it will then go outside and send the actual response down below, which will result in 2 responses to 1 request, leading to an error
   * So for this, either we will send the normal 200 response, inside the else block, or, we will wrap this 404 statement inside a return, not
   * because we want to return anything, but because anything after the return is not exceuted at all.
   */
  if (!place) {
    // res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provided id." });
    // NEW APPROACH - using throw to trigger

    // const error = new Error('Could not find a place for the provided ID.');
    // error.code = 404;
    // throw error;

    throw new HttpError("Could not find a place for the provided id.", 404);
  } else {
    //this is a special method, which sends back a JSON response to wherever it is imported, and whatever written in the json, is parsed accordingly
    res.json({ place }); // ==> {place} = {place:place} automatically. JS
  }
};

//Alternatives to above ->
// function getPlaceById() {...}
// OR const getPlaceById = function() {...}

const getPlaceByUserId = (req, res, next) => {
  const userid = req.params.uid;

  const user = DUMMY_PLACES.find((p) => {
    return p.creator === userid;
  });

  if (!user) {
    //   res
    //     .status(404)
    //     .json({ message: "Could not find a place for the provided user-id." });
    // NEW APPROACH - using next() to trigger

    // const error = new Error('Could not find a place for the provided user-id.');
    //   error.code = 404;
    //    next(error);

    //just simply create object of HttpError class and then pass them the arguments which will be displayed on the forthcoming error
    return next(
      new HttpError("Could not find a place for the provided user id.", 404),
    );
  } else {
    res.json({ user });
  }
};

/**No doubt we have written all the logic that is required for us, but now
 * we also will need to export this logic here and then use it to link it with the places-route.js file
 * 
 * Now we know that we can export using module.exports here. But that is for a single thing, and here we have multiple things
 * so for that, node has an alternative syntax for mass exporting.
 * => exports.{name whatever we want here} = {pointer to whatever we want to export}
 * => exports.getPlaceById(can be anything, but here we used the same function name) = getPlaceById(the function that we want to return)
 * 
 * 
 * Notice that here we don't do getPlaceById() and others, because we are not executing it here, express will do it on it's own, and then 
 * we just are sending here a pointer to the function to be executed
 */

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;