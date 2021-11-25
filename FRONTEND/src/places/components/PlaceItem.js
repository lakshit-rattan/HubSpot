import React from "react";
import { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showMap, setshowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openmapHandler = () => setshowMap(true);
  const closemaphandler = () => setshowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeletehandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closemaphandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actons"
        footer={<Button onClick={closemaphandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you Sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeletehandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p className="place-item__delete-text">
          Do you want to proceed and delete this place ?<br></br>
          Please note that it can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>

          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>

          <div className="place-item__actions">
            <Button inverse onClick={openmapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorID && (
              <Button to={`/places/${props.id}`}>EDIT PLACE</Button>
            )}
            {auth.userId === props.creatorID && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE PLACE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;

/**
 * Coming from App.JS to remove edit and delete button for log-out mode
 * use to context hi hona hai, so we'll import that useContext and AuthContext
 * Assign AuthContext to useContext and store the object in const auth.
 * Now use this auth to control the buttons
 * Put the condition that if isloggedin function in auth is true, only then render the 2 buttons, else not
 */
