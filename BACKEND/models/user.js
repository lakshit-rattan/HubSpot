const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  //unique:true will just crerate an index for the email, which will simply speed up the querying process if we request the email
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

/**Apart from everything, one thing missing here is to check specifically, the validation of the
 * email field that we have here, as unique:true will only speed up the querying process, not the validation
 * so for validation of email, we will need a special package called mongoose-unique-validator
 * we import the package, and after that the add it in the schema using line 15. So just by doing so, the package will validate all the inputs
 * for the fields having unique:true, which is only the email in our case, and this will help in the accounts not being created for the same email-ID twice.
 */
