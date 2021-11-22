const mongoose = require("mongoose");

/** Mongoose usually deals with schemas and models.
 * So basically our entire aim is to create a special schema for creating a new place in the database.
 * Now if we observe carefully, we basically DO HAVE a structured skeleton schema present.
 * The DUMMY_PLACES or DUMMY_PRODUCTS array that we used in the frontend to mimic the backend provides valuable information as to what
 * our requirements are for the databsae(title,description,image etc. etc.). So we will
 * use that structure to define our schema here, and hence our model.
 */

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  //NOTE -> unlike in DUMMY_PLACES, we will not be creating and ID schema here, simply because that MongoDB provides the default in-built feature of giving ID to whatever document that we store inside the DB, which would be our id tag
  title: { type: String, required: true },
  description: { type: String, required: true },
  //NOTE -> the image in the DB does mean the actual file. When we work with Databases, the image is always a URL, pointing towards a file, which is not stored in our database, because storing files or images in a database is not a good idea,
  //because it kinda contradicts the idea of a database ehich should be fast in execution, a point which would be heavily impacted if we store files or images in the database
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" }, //ref:true allows us to establish a connection between our current place.js schema and another schema(user.js in this case). Later going to be replaced by populate method
  //Similar implementation to be followed in user.js file.
});

/**Now we would be creating a model based on the schema mentioned above, using a special function in mongoose,
 * model function in itself, returns a constructor function later, which we will have to address. it takes 2 arguments, the name of the model that we want, and the
 * name of the schema that we want to implement in the model.
 */
module.exports = mongoose.model("Place", placeSchema);

/**After making the basic skeleton of the DB structure that we have, we now have to MAKE something out of this mode */
