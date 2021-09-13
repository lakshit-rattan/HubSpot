const express = require('express');
const bodyParser = require('body-parser');

/** It's our own wish that we can write here all the routes that we want. But that is simply not advised to.
 * Doing so would make the app.js file much much bigger and heavy to load. For that, what we do is, that we make a folder
 * called 'routes' and then add all the required routes into different files into that folder and then LINK those files to the app.js file.
 */
const placeRoutes = require('./routes/places-routes');

const app = express();

app.use(placeRoutes);

app.listen(5000);