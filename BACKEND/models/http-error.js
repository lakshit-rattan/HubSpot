/** Now here, we would be using the concept of models here to regularise the error handling model 
 * 
 * We start by making a new JS Class. Class is a blueprint for an object. This class will be inherited by the built-in Error class
 * but we can tweak it to work it the way we want to do.
 * Firstly, we will make a special constructor method which will instantiate the the function and we get a message & errorCode argument inside of it
 * Then we call super() to call the constructor of the parent class Error and forward the message property, to the instances (objects)
 * that we create, of this class and will also add another property, called 'code' which is = to the errorCode argument. Then we will
 * export this class using module.exports and then import it in the places-route.js file where we then will make an object of this class there and give them values
 * 
 * 
 * Now after getting basic error functionality, we now have to work on the other API routes, but before that we will need some restructuring as the more routes we have, the bigger this file will get
 * Therefore, it is better to follow a MVC STRUCTURE -> Model View Controller Structure
 * But here, we won't be having a view, because we're making a REST API, which is a backend thing, but here, we do have models, like the error blueprint & and CONTROLLERS
 * V IMP -> CONTROLLERS ->  Files that hold the actual logic, that should execute, when a certain route is reached.  So they glue together the incoming requests, and out models, and the logic that should run for such incoming requests.
 * Hence we will create a new folder called controllers and have a file called 'places-controller.js' for places logic and same for user, and the idea is that in that file, we have all the middleware functions which actually are reached for certain routes 
*/


class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //Add a "message" property
        this.code = errorCode; //Add a "code" property
    }
}

module.exports = HttpError;