import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

//importing validators for the form inputs
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setisLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputhandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  const authsubmitHandler = async (event) => {
    event.preventDefault();

    //console.log(formState.inputs);
    //Sending HTTP requests using fetch()
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          },
        );
        //we call the login function from AuthContext using auth object to toggle our login/signup context, and hence show the required navlinks that we require separately for both the authentications.\
        //it recieves not just userId, but also a token sent from auth-context which we use for authorization.
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData,
        );

        //we call the login function from AuthContext using auth object to toggle our login/signup context, and hence show the required navlinks that we require separately for both the authentications.
        //it recieves not just userId, but also a token sent from auth-context which we use for authorization.
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const switchModehandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid,
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false,
      );
    }

    //updating the state to check if it's in login mode or sign-up mode. The statement just reverse the previous state prevMode was in before.
    //now how do we use it in dom, 1) the Login button, it will say Login at login mode and sign-up at signup mode. Basically this new Name input addition is not being handled well by the form
    setisLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoginMode && (
          <React.Fragment>
            <h2>LOGIN REQUIRED</h2>
            <hr />
          </React.Fragment>
        )}
        <form onSubmit={authsubmitHandler}>
          {
            //Basically telling, that if the user is not in login mode, render whatever is there in these braces, which is the signup inputs, the first being the name, along with whatever is in the form below.
            //But here we encounter a problem, if we just do this, our buttons won't work even on user input because we're adding a new input which csometimes exist, ans sometimes doesn't
            !isLoginMode && (
              <React.Fragment>
                <h2>SIGNUP REQUIRED</h2>
                <hr />
                <Input
                  element="input"
                  id="name"
                  type="text"
                  label="Your Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a name."
                  onInput={inputhandler}
                />
              </React.Fragment>
            )
          }
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputhandler}
              errorText="Please provide an image."
            />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputhandler}
          />

          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password (at least 5 characters)."
            onInput={inputhandler}
          />
          <div className="btn">
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "LOGIN" : "SIGNUP"}
            </Button>
          </div>
        </form>
        <div className="btn">
          <Button inverse onClick={switchModehandler}>
            {isLoginMode
              ? "DON'T HAVE AN ACCOUNT ? SIGN-UP"
              : "ALREADY HAVE AN ACCOUNT ? LOGIN"}
          </Button>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default Auth;

/* From App.JS to NavLinks.JS to here for the contexts change state
we have to change the context upon clicking the login/signup button here. 
so first we will import the useContext and AuthContext here.
get the context from AuthContext to the auth object declared here
we then use the auth object and the login method we have, inside of our submit handlers(authsubmit handler) following comment there.

Now we see that we want is running successfully
Now it also might be nice that after logging in, the user, is again shown the home screen instead of the login page only, we basically want to leave this page
The most elegant way of doing that is going to the App.JS where we set all the routes, and we simply set up different routes for the loggedin and not loggedin state, and different redirections as well
so from here move to App.JS
*/
