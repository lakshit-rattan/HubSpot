/** Now we would be using the concept of models here to regularise the error handling model 
 * 
 * We start by making a new JS Class. Class is a blueprint for an object. This class will be inherited by the built-in Error class
 * but we can tweak it to work it the way we want to do.
 * Firstly, we will make a special constructor method which will instantiate the the function and we get a message & errorCode argument inside of it
 * Then we call super() to call the constructor of the parent class Error and forward the message property, to the instances (objects)
 * that we create, of this class and will also add another property, called 'code' which is = to the errorCode argument. Then we will
 * export this class using module.exports and then import it in the places-route.js file where we then will make an object of this class there and give them values
 * 
*/


class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //Add a "message" property
        this.code = errorCode; //Add a "code" property
    }
}

module.exports = HttpError;