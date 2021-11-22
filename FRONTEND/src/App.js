import React, { useState, useCallback } from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./user/pages/users";
import Newplace from "./places/pages/newplace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [isLoggedin, setisLoggedin] = useState(false);
  const [userId, setUserId] = useState(false);

  //to avoid infinite loops, dependency set to empty array shows that this object will be create just once.
  const login = useCallback((uid) => {
    setisLoggedin(true);
    setUserId(uid);
  }, []);

  //to avoid infinite loops, dependency set to empty array shows that this object will be create just once.
  const logout = useCallback(() => {
    setisLoggedin(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedin) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/places/new" exact>
          <Newplace />
        </Route>

        <Route path="/places/:placeid">
          <UpdatePlace />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/auth">
          <Auth />
        </Route>

        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedin: isLoggedin,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />

        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

//One needs to be careful regarding the order of the routes to mention.
//Here, if we place 'places/:placeid' route before the 'places/new', then we'll be having a problem.
//which is, that every url which starts with 'places/ and then something after it would reach  places/:placeid route, because, say we have places/new.
//then the 'new' will be interpreted as the dynamic placeid for the 1st route.So in order to avoid this, we will 1st route to the 'places/new' and then, if it's not the case, then route it over to the 'places/placeid'.

export default App;

/*
FROM "auth-context.JS"

//but how will we use it AuthContext here ? We will wrap the parts of our application that should be able to use that context with it
//So we basically will wrap the entire return, inside of the "<AuthContext.Provider>" tag, provider being a property of the createContext function, which in turn turns out to be a React Component in itself
//Now every component and element inside the Authcontext tag will have access to this authContext property
//now Provider also takes a 'value' prop, and here we bind the value that we manage with our context,initial value in auth-context.js, to a new value in the App.js
//Whenever this value attribute changes, all the components that listen to AuthContext, will re-render. NOTE - Not all components inside the AuthContext tag, but only those components who have called and updated AuthContext within themselves will get updated
//Now this is good, we can now manage some state in the App component(App.JS) and bind this to the value of our Context, and when the state changes, the value changes, which re-renders the listening components of the AuthContext 
//Now for this we will import useState and useCallback here, and initialise them inside the App component
//Following that, we will bind the value prop of the Provider to an object initialising all the functions to themselves, and now we can bind any components we want inside the tag to these values such that they become listener components to this value prop


Now the question is, that which components are interested in listening to this value prop ? Firstly, some of our NAVLINKS !! there are some navlinks we wanna show if we are authenticated and not if we are not authenticated
so, from here we will then head to navlinks.JS

*/

/** Coming from Auth.JS to make separate routes for the loggedin and not loggedin states
 * take new var routes
 * check if isLoggedin is true,set routes to specific set of routes, else set routes to other specific set of routes
 * copy the rputes written in switch to their specific locations in the if-else block
 * Adding multiple routes together will result in react single element wrap error, so we use the <react.Fragment> tag around them and in between the <Switch> tag, we just add the router variable
 * Implying this, encounters a problem, when we go to new place tab, we see that the 'No new places here to see' errortext is being shown down the form, which we need to avoid
 * It happens, because our switch might not be working correctly, because the React.Fragment tag in the if-else might be breaking the functionality of the tag. Hence we then just replace <React.Fragment> tag with the <Switch> tag in the if-else block, and remove it down in the return statement, hence emliminating the error...
 *
 * Our next functionality, is also to provide a LOGOUT button when the user is logged in, and hide the DELETE PLACE and EDIT PLACE button when the user is in log-out mode
 * for this we head to the Placeitem.JS - for the buttons & Navlinks.JS - for the Logout button
 */
