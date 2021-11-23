import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>

      {auth.isLoggedin && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}

      {auth.isLoggedin && (
        <li>
          <NavLink to="/places/new">NEW PLACE</NavLink>
        </li>
      )}

      {!auth.isLoggedin && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}

      {auth.isLoggedin && (
          <li>
              <button onClick={auth.logout}>LOGOUT</button>
          </li>
      )}
      
    </ul>
  );
};

export default NavLinks;

/* From App.JS for the contexts thing
Here we first import the Authcontext and a new hook from react - useContext, which allows us to tap into a context and listen to it
then we tell the useContext we want to tap into the AuthContext context and what we get(inside auth const) is an object which will hold the latest context and this component will re-render whenever this context changes. that is the magic of react ! hover over auth and you will see what it holds.
we will now use this auth here to do what we wanted to
MY PLACES should only be visible if we are logged in. so we will bind the MY PLACES navlink to auth object, and check , if auth is in loggedin state, then only show this, else not
Similar will be the case for the NEW PLACE link
AUTHENTICATE only makes sense, when we are NOT logged in, so we'll check if auth is in NOT loggedin state, only then show this link

our next step is to see, that if we click the login Button on the authencticate page, our context changes also.
so from here, we move to the Auth.JS 
*/
