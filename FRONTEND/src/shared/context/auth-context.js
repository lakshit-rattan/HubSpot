/*CreateContext is a built-in function in React that we will extract here
Here we will implement the concept of 'CONTEXT' in react. Context allows us to pass data between any components in our application WITHOUT the use of props.
Then we make a createContext() object which we will then use to share contexts between components*/

import { createContext } from "react";

//basically initialising the createContext function with some default initialisation value
//Then storing this function inside the authcontext const, and then exporting this const
//THIS authContext is now an object that we can share between the components, and when we will update this, any component listening to it will also update itself automatically
//There's a reason why createContext is not a regular JS object, and we have to create it with createContext in the end.
export const AuthContext = createContext({
  isLoggedin: false,
  userId: null,
  login: () => {},
  logout: () => {},
});

//This export will now 1st be used inside App.JS
