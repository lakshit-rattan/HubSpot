const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../BACKEND/auth.env" });

/** It's our own wish that we can write here all the routes that we want. But that is simply not advised to.
 * Doing so would make the app.js file much much bigger and heavy to load. For that, what we do is, that we make a folder
 * called 'routes' and then add all the required routes into different files into that folder and then LINK those files to the app.js file.
 */
const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

//this will parse any incoming requests body and extract any JSON data which is in there, convert it into regular JS Data structures like objects and arrays, and then call next() automatically so that we reach the next middlewares which are our own custom routes and then also add the JSON data here.
// So in placescontroller.js, we will now be able to get the parsed body for the POST request, which was the reason that we used it here using the req.body property

/**Middleware to handle CORS errors.  
 * CORS - Cross origin Resource Sharing. This type of error is usually faced when interacting with an API from within the localhost. 
 * The general idea of the CORS concept is that the resources on a server can ONLY be requested by the requests, coming in from the same server. Therefore, as our backend is running on localhost:5000, the resources can ony be used if a request comes only from localhost:5000
 * But this is not the usual case, as our front-end is hosted on localhost:3000. Even though both are running on localhost, but it's not that they are on the same port. the point is, don't think they are. just don't mix.
 * CORS is a security concept ENFORCED by the the BROWSER only, which is why we had no problems like this with PostMan. So it's a Browser(Frontend) error.
 * So in order to work around that, the server has to attach certain headers to the responses it sends back to the client, that the client uses, in order to use the server resources. So for that, 
 * we then make a middleware here and declare whatever headers that are sent back along with the response by the server to the browser, which will allow the communication, neutralising the CORS errors. 
*/
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //* means allow access to all, it's an argument passed to the "Access-Control-Allow-Origin" policy.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

//Now there is one thing that we need to take care of. that is, according to the api's that we need, we have to have 2 SET of API's. '/api/places/....' and '/api/users/....'
// so we have to add a FILTER on this middleware, such that it is executed only on the path that we specify. so for use(), it is not necessary to give the path filter, but we CAN.
// This filter that we put, will also not be treated as, the route should be EXACTLY as specified in the filter, but have to just START from it. can be more than that also.
app.use("/api/places", placeRoutes);
//now expressJS will only forward requests to our placeRoutes Middleware if their path STARTS from '/api.places/' NOTE - Path can be longer than that also.
// '/api/places/something' -> VALID
// '/api' -> INVALID
// The Route filter that we add in App.js GET method, has to be prepended to the route that is specified here.
// so if we want to have GET requests for say,'/api/places', we must not repeat it in app.js, rather take the main filter to app.js and put the filter of whatever is going to AFTER the main filter, i.e, whatever is going to be after '/api/places'. can be anything

//Similarly we do the same for the userRoutes, we define a specific route substituting default '/api/users' route to all the routes in the users-routes.js file
app.use("/api/users", userRoutes);

//This middleware is here for handling all the UN-Supported requests that are hit to the network. Handling errors for unsupported routes.
//Just a normal middleware, it only runs if we didn't a response in one of our routes before, because if we do send a response, we call next() and no other middleware after that middleware
//will be executed. So this middleware willo only be reached if we didn't get any previous response to it, and that can only be a request which we don't want to handle
//Inside, we just want to give a 404 error along with a message, which is why we will use the default error handler(http-error.js) for that purpose.
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

/**Special error handling middleware function.
 * As you can see, it has 4 arguments, and whenever we have 4 arguments in a function, the compiler will automatically understand that this is the special error handline function
 *
 * we will first check inside it, if any response has been already sent back or not(the if condition). if it has been, then we need not send another response, and will pass the error argument into the next function
 *
 * then we will check for a 'code' property in the error object, if it is present, given in the other files. if not, assign it a default status code value of 500(error 500 -> something went wrong on the server)
 * Then we will be sending back a json response with a message proerty, because every error that we send back from the api, should have the message property, which the attached client can then use to show the error message that we can use. if we have an error message, then we use it, else, we give it a default error ahead of the OR statement
 * Now that is our body. and now, we will trigger it in the places-route file, in 2 ways:
 * 1. we a thorw a new error there
 * 2. or, we call next(), and pass the error to it. both work.
 * But the difference lies in the fact that, if we would be in some asynchronous code, which is not the case right now here, then our way 1, throwing exception, will be the best option to work with. But if we ARE in some ASYNCHRONOUS code here, then we will have to use next(error) object approach
 * Implementation will be shown in both ways, but later, only next() will be used because the code will be asynchronous
 */
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

//putting the DB condition. if there is a successful connection to the database, only then open the server at port 5000, else give back the error.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
