import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";

import "./Input.css";

const inputReducer = (state, action) => {
  //It's upto us how we determine which action do we have, but often we will dispatch actions that have a 'type' property, which have a unique identifier that describes the action
  switch (action.type) {
    //Wait for "CHANGE" action, but totally upto us which identifier we use.
    case "CHANGE":
      //return a new state(here a new state object). we can basically return anything here, not just the object
      return {
        //Creating a copy of the old state first as a backup, using the spread(...) operator. Copies all the new key-value pairs of the old state object, into the new state object.
        ...state,
        //After this, we'll be overwriting the selected keys from the old backup object

        //again. depends on us how we want to store the value in the actions.
        //Storing the val property on the action object which we'll eventually dispatch
        value: action.val,

        //Validation logic which we can replace instead of the true.
        isValid: validate(action.val, action.validators),
      };

    //Handling the touch case(Onblur) event
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }

    //In case of an action that is not defined, we will be returning the previous state only as our new state.
    default:
      return state;
  }
};

const Input = (props) => {
  //We can ofcourse import the UseState Hook and have 2 separate states that ar interlinked with each other (enteredvalue, and isvalid), but honestly
  // in the scenario where you have more than 1 states which are dependent on each other, we tend to use the UseReducer hook there, which is a better Option
  //UseReducer also allows to manage state in a component and it also gives you a function to call to update & re-render the component, but the difference lies
  // in the fact that handling complex states better with ease are possible in useReducer compared to 'useState'.

  //How to use ? we call the useReducer Function and pass it 1 argument, called the 'Reducer', which in itself is just a function (here, inputReducer function)
  // which receives an "action", which we can "Dispatch". and it recieves the current state, which we then update, based on the action which we recieve, return
  // the new state to useReducer, which will give the state to the component and hence, re-render it completely.
  //useReducer also takes up a 2nd optional argument, which is the initial state
  //Here, initial state is an empty value string and a false isvalid state
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initial_value || "",
    isTouched: false,
    isValid: props.initial_valid || false,
  });

  //Just like UseState, UseReducer will return an array with EXACTLY 2 elements. Hence we can use array destructuring above to get the 2 elements of the array it returns
  //It will return a 1. Current State and 2. A dispatch function we'll call. This is how we'll dispatch the actions to the reducer function, which will run through to function, return a new state, and then re-render the new state

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    //Give the dispatch an action of type mentioned above
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  //We notice that our textbox is by default red, and throwing warnings. While that is good, but we
  //want to give the user a chance to 1st enter something, and then, if it's invalid, throw out the errors
  //For this, rather on onChange, we also send a OnBlur prop to the Input which then tell the browser to display the
  //warnings only when the user loses focus on the text box once. so touchHandler will be the function for the onBlur event
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        // To reflect the changes of the input validation, we bind the value of the the input back to the inputstate.
        // BTW, in react, we cannot set the value of the textarea by writing the value in between the tags. we have to
        // pass the value as a prop, like below
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        // To reflect the changes of the input validation, we bind the value of the the input back to the inputstate.
        // BTW, in react, we cannot set the value of the textarea by writing the value in between the tags. we have to
        // pass the value as a prop, like below
        value={inputState.value}
      />
    );

  return (
    // '${!inputState.isValid && 'form-control--invalid'}` basically means that, if the inputstate comes out to be
    //false, then we'll add another class to the div, called form-control--inavlid which reddens the error message.
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
    //'{!inputState.isValid && <p>{props.errorText}</p>}' means if inputstate is
    //false, then we want to render whatever text is present in the para tag
  );
};

export default Input;
