//Holding all the useReducer Logic set up in newplace.js

//We'll be creating a custom hook here.
//Hook - It's just a normal JS function but a specific function which starts with the word 'use', which is just a convention.
//More importantly, it's a function which CAN SHARE STATEFUL LOGIC, or a function which can use 'useReducer' or 'useState' inside of it, which then React recognises, and uses such
//that when in this custom hook, you do something that updates a state, your component that is using this hook, is then re-rendered

//Basically it's just a very special function react recognizes, inside of which if you do something that changes the state, the components using this hook are re-rendered automatically by react.

import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formisValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formisValid = formisValid && action.isValid;
        } else {
          formisValid = formisValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formisValid,
      };

      case 'SET_DATA':
        return {
          inputs: action.inputs,
          isValid: action.formisValid
        };

    default:
      return state;
  }
};

//Custom hooks, ALWAYS have to start with lower-case 'use'
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    //Initial state
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);


  const setFormData = useCallback((inputData,formvalidity) => {
     dispatch({
      type:'SET_DATA',
      inputs:inputData,
      formisValid:formvalidity
    })
  },[]);
  return [formState,inputHandler,setFormData];
};
