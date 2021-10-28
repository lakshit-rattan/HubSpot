const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

//a 3rd party npm package used to generate dynamic unique id's. there are different versions of the id's it generates, so the version we need is v4, which also has a timestamp component in it
const { v4: uuidv4 } = require("uuid");
const coordinatesForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
  const userid = req.params.uid;

  const places = DUMMY_PLACES.find((p) => {
    return p.creator === userid;
  });

  if (!places || places.length === 0) {
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
    res.json({ places });
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    next(
      new HttpError(
        "Invalid Inputs passed, please check your data again.",
        422,
      ),
    ); // 422 -> invalid input status code
  }

  /**for the POST request, we expect to have the data inside the BODY of the post request
  Because whilst the GET requests don't have a request body, POST requests DO, and we ENCODE the data we want to send with the POST request into the BODY of the post request
  Now to get the data, out of the body, we can take help of a package called 'body-parser' we learnt about earlier. so we add a new middleware in app.js 
  and we will do it before it reaches the places-routes.js file, because we first want to parse the body, and then reach the routes where we want to parse the data so here, hume kata kataaya data already miljaayega. 
  so we go to app.js from here.  So in places-controller.js, we will now be able to get the parsed body for the POST request, which we will use using the req.body property
  We here will user object destructuring to filter out only the data that we need here out of the data that we recieve in the POST request
  */

  // The logic down below will later be replaces by some MongoDB logic, but temporarily working logic would be provided for the array
  const { title, description, address, creator } = req.body;
  // short form for -> const title = req.body.title, const description = req.body.description ...............

  let coordinates;
  try {
    coordinates = await coordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://www.history.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTU3ODc3NjU2NzUxNTgwODk1/this-day-in-history-05011931---empire-state-building-dedicated.jpg",
    creator,
  });

  //we need a unique id, which we will make from an extra npm package -> uuid which is especially used to generate unique ids

  //**NOT IN USE ANYMORE DUE TO MONGODB**
  //for adding the data into the database
  //DUMMY_PLACES.push(createdPlace);
  //DUMMY_PLACES.unshift(createdPlace); => if we want to push it as the first element in the array

  //Instead, this used :->
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Place Failed. Please try again later.",
      500,
    );
    return next(error);
  }
  //After creating the new location successfully we now have to send back some response
  res.status(201).json({ place: createdPlace });
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
object of place in the dummy places array and we can validate this by going to /places/api/u2 where we will see the details  in JSON format, and send this, this adds a new ob
Please note - that this storage in the array, will be TEMPORARY. it will not be permanent. once we restart the server, this newly created object will dissapear and we
will later replace it with some MongoDB logic, and we will have to send the request again to see this logic.
 */
};

/**function for the PATCH request -> Update an existing place by ID
 * for a patch request, we also need a request body, because if we want to update a place's data, then we will also need to have it's existing data before making changes
 *
 * As we will only allow the change of the title and description of the place, we will just need that in the request body, and not anything else.
 * We also will need the unique pid for every place also. We typically ENCODE the identifying criteria, which is the pid, into the URL, and the data
 * with which it should work, with the request body
 */
const updatePlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError(
      "Invalid Inputs passed, please check your data again.",
      422,
    ); // 422 -> invalid input status code
  }

  const { title, description } = req.body;
  //getting the dynamic pid into the const
  const placeid = req.params.pid;

  //we check and find the place in the dummy array and return it if found.
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeid) };
  //Now we want to update the place in an "IMMUTABLE" way, i.e we don't want to start working on the properties like -> updatedplaces.title = title, because that would immediately change it in the dummy parent array
  //Although it won't be bad if we directly change like this in the parent array, but is considered a bad practice, because in case, we're saving our data or saving parts of our data would fail, then some parts of the data would be updated and some won't, which will result in corruption of the file
  //So as a remedy, we first want to create a copy of place, save the copy, and once saved successfully, then change it in our parent array or place. so for that we will use the spread operator, and enclose the term in curly brackets,
  //this will mean that updatedPlace will get all values of dummy places, also along with the finded place

  //Set the entered updated value of the title and description to the one in the array
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeid);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => (p.id = placeId))) {
    throw new HttpError("Could not find a place for the requested id", 404); //401 -> Status code for authentication failure
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res
    .status(200)
    .json({ message: "Your Place has been deleted successfully." });
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
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
