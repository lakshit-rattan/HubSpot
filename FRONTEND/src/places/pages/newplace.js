import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";

const Newplace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      /**sendRequest takes 3 args:
       * 1. the link to where the request is to be sent
       * 2. the type of request to be send (GET/POST/etc)
       * 3. the headers argument which we deliberately send to modify the 'Authorization' token 
       * such that it comes in a format we wrote the code for in a specific manner, ie, "Bearer TOKEN" format
       */
      await sendRequest(process.env.REACT_APP_BACKEND_URL+"/places", "POST", formData, {
        Authorization: 'Bearer ' + auth.token
      });
      /**But even after this,  we would be getting an error. this error would be of "OPTIONS" type
       * "OPTIONS" being the name of the header, even though we sent a POST request here. 
       * What is this ? This is basically a browser behaviour. Basically, apart from anything but GET requests,
       * the browser automatically sends an OPTIONS request before it send the ACTUAL request we want to send to find out whether the 
       * server will permit this to-be-sent request. We can't do anything about it, just that we have to know it and handle it. 
       * The OPTIONS request has no token attached and it doesn't need to. so we will filter this in check-auth.js file
      */




      //Dummy checking data here. Later, we'll be sending this data to the backend server for processing
      //console.log(formState.inputs);

      //Redirect the user to a different page
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          placeholder="Title text here"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a valid Title."
          onInput={inputHandler}
        />

        <Input
          id="description"
          element="textarea"
          label="Description"
          placeholder="Description text here"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please Enter a valid description (Atleast 5 characters)"
          onInput={inputHandler}
        />

        <Input
          id="address"
          element="input"
          label="Address"
          placeholder="Description text here"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a valid address"
          onInput={inputHandler}
        />

        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default Newplace;
