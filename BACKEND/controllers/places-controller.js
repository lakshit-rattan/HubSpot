const HttpError = require("../models/http-error");

//a 3rd party npm package used to generate dynamic unique id's. there are different versions of the id's it generates, so the version we need is v4, which also has a timestamp component in it
const { v4: uuidv4 } = require('uuid');

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


const createPlace = (req,res,next) => {
  /**for the POST request, we expect to have the data inside the BODY of the post request
  Because whilst the GET requests don't have a request body, POST requests DO, and we ENCODE the data we want to send with the POST request into the BODY of the post request
  Now to get the data, out of the body, we can take help of a package called 'body-parser' we learnt about earlier. so we add a new middleware in app.js 
  and we will do it before it reaches the places-routes.js file, because we first want to parse the body, and then reach the routes where we want to parse the data so here, hume kata kataaya data already miljaayega. 
  so we go to app.js from here.  So in places-controller.js, we will now be able to get the parsed body for the POST request, which we will use using the req.body property
  We here will user object destructuring to filter out only the data that we need here out of the data that we recieve in the POST request
  */

  // The logic down below will later be replaces by some MongoDB logic, but temporarily working logic would be provided for the array
  const {title, description, coordinates, address, creator} = req.body;
  // short form for -> const title = req.body.title, const description = req.body.description ...............
  
  const createdPlace = {
    //uuid() generates a unique id field and stores it in the 'id' field
    id: uuidv4(),
    title,
    description,
    location:coordinates,
    address,
    creator
  }

  //we need a unique id, which we will make from an extra npm package -> uuid which is especially used to generate unique ids

  // for adding the data into the database
  DUMMY_PLACES.push(createdPlace); 
//DUMMY_PLACES.unshift(createdPlace); => if we want to push it as the first element in the array

//After creating the new location successfully we now have to send back some response 
res.status(201).json({place:createdPlace}); 
//200 -> standard status code for a successfull execution in general, but when we create something new, we send back 201
//201 -> Standard status code that we send back when there is something created successfully on the server
//Also we return the new place object that we created back to the app.js

/** 
 * Now the focus lies on the fact that HOW will we send the POST request here. Why ? 
 * because if we modify url to /api/places, we get the "Cannot GET /api/places". But why ?
 * the reason is, that whenever we self modify the url in the address bar, it is always BY DEFAULT, considered 
 * to be a GET request, because we have no GET route specified for the route, we have a POST route.
 * To send a POST request, we can add some JS code that can do our work, but it won't work properly either, 
 * so for now, we'll be using for this purpose, the POSTMAN software, which allows us to test and send requests to the API's
 * So now when we send the request in postman like :
 * {
    "title":"New York Stock Exchange",
    "description":"Where the money lives",
    "creator":"u2",
    "address":"11 Wall St, New York, NY 10005",
    "coordinates": {
        "lat": 40.7063069,
        "long": -74.01039
    }
  }
ject of place in the dummy places array and we can validate this by going to /places/api/u2 where we will see the details  in JSON format, and send this, this adds a new ob
Please note - that this storage in the array, will be TEMPORARY. it will not be permanent. once we restart the server, this newly created object will dissapear and we
will later replace it with some MongoDB logic, and we will have to send the request again to see this logic.
 */
}




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
exports.createPlace = createPlace;
