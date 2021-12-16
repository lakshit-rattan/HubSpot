const HttpError = require("../models/http-error");

//for deleting the respective place IMAGE, using the unlink() method inside it
const fs = require('fs');

const { validationResult } = require("express-validator");

//a 3rd party npm package used to generate dynamic unique id's. there are different versions of the id's it generates, so the version we need is v4, which also has a timestamp component in it
const { v4: uuidv4 } = require("uuid");

const coordinatesForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const place = require("../models/place");

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

const getPlaceById = async (req, res, next) => {
  const placeid = req.params.pid;

  let place;
  try {
    // const place = DUMMY_PLACES.find((p) => {
    //   return p.id === placeid;
    // });
    //Using below code instead of above one. findById() -> static method present inside mongoose
    //Keep in mind that conceptually, findById() do0esn't return a promise(virtually, it does), even though catch or async on it would be deemed valid.
    //incase we want to get a real promise from findById, we would use the exec() function, which will return a real promise from it
    place = await Place.findById(placeid);
  } catch (err) {
    const error = new HttpError(
      //This error is basically displayed when our GET request has some kind of problem within itself(eg- missing information).
      "Something went wrong, could not find a place.",
      500,
    );
    return next(error);
  }

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

    const error = new HttpError(
      "Could not find a place for the provided id.",
      404,
    );
    return next(error);
  }

  //this is a special method, which sends back a JSON response to wherever it is imported, and whatever written in the json, is parsed accordingly
  res.json({ place: place.toObject({ getters: true }) }); // place.toObject({ getters: true }) }) what it will do, is that the _id parameter of the DB entry, will be converted to 'id', something that we want, for our convenience while development.
  //Why ? because mongoose adds an ID getter to every document which return the ID as a string. Such getters are usually lost when objects are called, but with getters:true, we avoid this and tell mongoose to create an id property to the newly created object.
};

//Alternatives to above ->
// function getPlaceById() {...}
// OR const getPlaceById = function() {...}

const getPlacesByUserId = async (req, res, next) => {
  const userid = req.params.uid;

  //let places;
  // if (!places || places.length ===0) {
  // }
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userid).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500,
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
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
    res.json({
      places: userWithPlaces.places.map((place) =>
        place.toObject({ getters: true }),
      ),
    });
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
    image: req.file.path,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed. Please try again later.",
      500,
    );
    console.log(err);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided ID.", 404);
    return next(error);
  }

  console.log(user);
  //we need a unique id, which we will make from an extra npm package -> uuid which is especially used to generate unique ids

  //**NOT IN USE ANYMORE DUE TO MONGODB**
  //for adding the data into the database
  //DUMMY_PLACES.push(createdPlace);
  //DUMMY_PLACES.unshift(createdPlace); => if we want to push it as the first element in the array

  //Instead, this used :->

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Place Failed. Please try again later.",
      500,
    );
    console.log(err);
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
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid Inputs passed, please check your data again.",
        422,
      ), // 422 -> invalid input status code
    );
  }

  const { title, description } = req.body;
  //getting the dynamic pid into the const
  const placeid = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Place",
      500,
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this place !",
      401,
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Place",
      500,
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500,
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this ID.", 404);
    return next(error);
  }


  const imagePath = place.image;

  try {
    //await place.remove();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove();
    ({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500,
    );
    return next(error);
  }
  fs.unlink(imagePath,() => {
    console.log(err);
  });

  res
    .status(200)
    .json({ message: "Selected Place has been deleted successfully." });
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
