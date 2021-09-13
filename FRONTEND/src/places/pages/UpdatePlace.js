import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";


import "./PlaceForm.css";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous SkyScrapers in the world",
    imageurl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous SkyScrapers in the world",
    imageurl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

//basically fetch the placeid from the backend and then change the information regarding the place. but for now, just work with some dummy data from userplaces.js
const UpdatePlace = () => {
  const [isLoading,setisLoading] = useState(true);

  //useparams.placeid referring to the identifier placeid in the app.js file
  const placeid = useParams().placeid;


  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  //find a place from the array using the id parameter
  //Later in the course, we'll be fetching this data from the backend.
  //Please keep in mind, that custom hooks, or hooks, in general HAVE TO BE used DIRECTLY into the components in React. We cannot use hooks inside of any other loops/blocks (if/else,switch,then etc.)
  const identifiedplace = DUMMY_PLACES.find(p => p.id === placeid);


  useEffect(() => {
    //This makes sure that if we put in the link /places/p3(an undefined id), it should not give us any error, which it will give if we put this out of the 'if' condition
    if (identifiedplace)
    {
      setFormData(
        {
        title: {
          value: identifiedplace.title,
          isValid: true
        },
        description: {
          value: identifiedplace.description,
          isValid: true
        }
      }, 
      true
      );

    }
  
  setisLoading(false);
}, [setFormData,identifiedplace]);


  const updatesubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  //Incase we don't find any place that is matching with the placeid, a fallback
  if (!identifiedplace) {
    return (
      <div className="center">
        <Card>
        <h2 className="header">Could not find any Place matching your search !</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  //Now say we found a place matching the placeid, then we want to render a form which we initialise with values from the place it already had.
  return (
    <form className="place-form" onSubmit={updatesubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid Title."
        onInput={inputHandler}
        initial_value={formState.inputs.title.value}
        initial_valid={formState.inputs.title.isValid}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid Description (minimum 5 characters)."
        onInput={inputHandler}
        initial_value={formState.inputs.description.value}
        initial_valid={formState.inputs.description.isValid}
      />

      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
