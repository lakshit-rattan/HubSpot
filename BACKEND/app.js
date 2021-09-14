const express = require('express');
const bodyParser = require('body-parser');

/** It's our own wish that we can write here all the routes that we want. But that is simply not advised to.
 * Doing so would make the app.js file much much bigger and heavy to load. For that, what we do is, that we make a folder
 * called 'routes' and then add all the required routes into different files into that folder and then LINK those files to the app.js file.
 */
const placeRoutes = require('./routes/places-routes');

const app = express();

//Now there is one thing that we need to take care of. that is, according to the api's that we need, we have to have 2 SET of API's. '/api/places/....' and '/api/users/....' 
// so we have to add a FILTER on this middleware, such that it is executed only on the path that we specify. so for use(), it is not necessary to give the path filter, but we CAN.
// This filter that we put, will also not be treated as, the route should be EXACTLY as specified in the filter, but have to just START from it. can be more than that also.
app.use('/api/places',placeRoutes);
//now expressJS will only forward requests to our placeRoutes Middleware if their path STARTS from '/api.places/' NOTE - Path can be longer than that also.
// '/api/places/something' -> VALID
// '/api' -> INVALID
// The Route filter that we add in App.js GET method, has to be prepended to the route that is specified here. 
// so if we want to have GET requests for say,'/api/places', we must not repeat it in app.js, rather take the main filter to app.js and put the filter of whatever is going to AFTER the main filter, i.e, whatever is going to be after '/api/places'. can be anything 
app.listen(5000);