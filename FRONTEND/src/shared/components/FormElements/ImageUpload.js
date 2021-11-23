import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    //if the file is not there, no need to go forward and go back
    if (!file) {
      return;
    }

    //if the file exists then execute the following
    //built-in JS feaature API which helps us read file and which will help us create a image preview URL
    const fileReader = new FileReader();
    //function that would be executed BEFORE the NEXT command, i.e, whenever the file is done parsing.
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    //command to create a URL that we can output, but has some limitations. It doesn't work with a callback, doesn't return a promise
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      //event.target always have a 'files' property IF The target is of type="files" (as stated above) which holds the file
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg,.svg,.webp"
        onChange={pickedHandler}
      />
      {/**Accept is a default attribute that we can add on inputs of type="file" */}
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
