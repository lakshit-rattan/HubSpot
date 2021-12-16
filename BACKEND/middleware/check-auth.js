const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  
  //Checking for the request method if it is an OPTIONS request from the frontend, then pass on the request as it is and not block it.
  if (req.method === "OPTIONS") {
    return next();
  }
  
  /**From where do we now get the token from, in here ?  The request body might be one good way of doing so
   * but in actuality, not all routes have a req body in them (eg - delete, get routes don't have a request body)
   * hence request body here is not a good option. the other alternative is the "query params" in the url (one that is
   * like "?token=iadjfio") which would also be a good way, but the best way for all cases, is using the headers,
   * because we don't have to worry about any other parameters. so we use one 'authorization' header here to
   * extract thhis data from which we then extract the token.
   */
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication Failed !");
    }
    //if we do in the end have a token, it might still be invalid. so for that, we would need to verify that token
    //which is done using the same "jsonwebtoken" package using certain functions like verify() etc
    //verify() takes 2 args. 1st -> the token and 2nd-> the private key used to make the token. in the end, it returns
    //the payload that was encoded into the token, which is the userid and email which we verified.
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    /** keep in mind that in app.js while adding headers using setHeader function, we also added one 'Authorization'
     * header there, which is this one that we're using here, as headers are case-insensitive "Authorization"(app.js) and
     * "authorization"(here) mean one and the same thing.
     *
     * Keep in mind that this header will not be like :
     * Authorization: TOKEN
     * but something like
     * Authorization: "Bearer TOKEN" as a value to indicate that this request bears such a token a here
     * So then we would have to split this value at the blank space, and get the 2nd part as our token
     */
    const error = new HttpError("Authentication Failed !", 401);
    return next(error);
  }
};
