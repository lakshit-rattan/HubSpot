const express = require("express");
//Wherever we wish to use express, we HAVE to import the express library from node modules.

//importing the http-error file class for error-handling. now we just have to create the bject sof this class here wherever we want and then pass them the errorcode and the error message
const HttpError = require("../models/http-error");

const placeControllers = require("../controllers/places-controller");

//using a special function called router in express
const router = express.Router();
 
//setting the GET method for the '/' path for the router const
//We actually now want to have a GET request, where the ID is part of the URL. the idea is that we send the request to the API '/places/p1' for eg, and that gives us the data for the place for the ID p1
//So the ID should be endcoded in the URL(Dynamic ID). To tell express that we have a dynamic segment (which we don't know in advance), we add a colon(:) in our filter and then any identifier of our choice, which is then identified by EXPRESS as a dynammic id and works fine
//So now, as we know how to succesfully enter into this pid target, we now want to return the place associated with that pid from the database/duummy data
/**
 * For that, we need to first get the value that is entered into the dynamic pid compare the value with the values present in the Database/dummy data, and the return the necessary data
 * ExpressJS covers this too. we get the pid by using the 'Request' object and there we will have a 'params' property
 * 'params' -> this property is added by ExpressJS, which in the end, holds an object, where our dynamic segments are stored as KEYS, and it's values, will be the values entered by the user in place of that dynamic segment. eg- {pid:'p1'}
 */
// The '/api/places/:pid' route, after the route, it is referring to the places-controller.js function pertaining to the logic that needs to be used here
router.get("/:pid", placeControllers.getPlaceById);

//implementing the '/api/places/user/:pid' route. after the route, it is referring to the places-controller.js function pertaining to the logic that needs to be used here
router.get("/user/:uid",placeControllers.getPlaceByUserId)


/**Adding a POST route. the address here will be / because we don't have any specific route here for the POST request in accordance to the table that we drew for the routes
*/
router.post('/', placeControllers.createPlace);


//These will not clash with the above methods, because they differ by the type of requests. above it is the GET request, and below it is a PATCH request
router.patch('/:pid',placeControllers.updatePlace);

router.delete('/:pid',placeControllers.deletePlace);


//Exporting the const named router. this is the general syntax for exporting.
module.exports = router;

/** Now there is a wondering that '/api/places/user/u1' gives us the id, but if we write u2 or any creator id not defined in the array, then that returns us -> {} (empty object)
 * Similarly, if we do '/api/places/user', then this also gives us empty object. but if we do '/api/places', then this will give us -> "Cannot GET /api/places", basically meaning that the route for this hasn't been defined
 * But why is that ?
 * That is a little Gotcha we have here. The ORDER of routes MATTER here.
 * Basically,
 * route 1 -> /api/places/:pid -> is able to handle any dynamic value after /api/places
 * route 2 -> /api/places/user/:uid -> is able to handle any dynamic value after /api/places/user
 *
 * when we write /api/places/user/p1 or p2, we are referring to the 2nd route. but when we just mention, /api/places/user, even though we want this to refer to route 2, it gets referred to route 1 actually, because, route 1 being in precendence, sees the 'user' in /api/places/user as a dynamic value to the :pid key. as as there is no match for the
 * requested key in the array, it returns an empty object. So that is why we get the empty object then, which actually referrs to Route 1.
 * In our project, we don't need a special route for /api/places/user, so there is no problem in the current working of it. because it's not a requirement. BUT, in case, we had to have a specific route to /api/places/user, then, we would need to have the route 2, ABOVE the route 1, else, express will consider the route 2 path, also as for route 1, due to it's precendence.
 * It is for this reason, that PRECEDENCE will MATTER. this is something that needs to be known.
 *
 *
 * At the current moment, in case someone writes a dynamic value not present in our dummy array, we return an empty object, with a 200(OK) status, which shouldn't be the case if we didn't find anything. it should rather be a 404 Error status.
 * So for that we need error handling. so if (!place) is falsy, meaning the place const in undefined, then we want to return a different response which will be the error status.
 * now as you can notice now, that for every request that we specify, we have to make a separate error status message, which is a lot of code duplication.
 * So for that, we use something built-in in Express called default Error Handler, which we set-up in app.js as a middleware
 */