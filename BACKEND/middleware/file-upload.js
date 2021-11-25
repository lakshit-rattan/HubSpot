/** Here in this file, we would extract and modify and use MULTER as per our requirements for our project
 * Although multer can be used as it is, still we would use it here as per our needs, specifically for file uploading
 * Multer is not a single middleware, it's a group of middewares, which we use according to our needs
 */

//declare the multer object
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/svg": "svg",
  "image/webp": "webp",
};

//execute it as a function, to which we can pass a configuration object, the result of which is stored in the fileUpload const
const fileUpload = multer({
  limits: 10000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

//this here is not a middleware being exported, but an object of middlewares, out of which we choose what we want to use
module.exports = fileUpload;
