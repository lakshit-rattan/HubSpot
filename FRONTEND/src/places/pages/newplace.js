import React from "react";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";


const Newplace = () => {
  
  const [formState,inputHandler] = useForm(
    {
      title: { 
        value: "", 
        isValid: false 
      },
      description: { 
        value: "", 
        isValid: false 
      },
      address: { 
        value: "", 
        isValid: false 
      }
    },
    false
    );



  const placeSubmitHandler = (event) => {
    event.preventDefault();

    //Dummy checking data here. Later, we'll be sending this data to the backend server for processing
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
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

      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default Newplace;
