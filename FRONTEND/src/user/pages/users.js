import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  /**DON'T do useEffect(async () =>...). Don't make the fetch request and useEffect in async and await.
   * Although it would work fine, it is a bad coding practice, because it goes against what useEffect expects here. It does not expect back a promise of any type here.
   * but any Asynchronous request always gives back a promise, hence discouraged to do so. Rather it's better to create a separate function for it
   */
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);

      try {
        //should be a GET request. with fetch(), the default type is always a GET request
        const response = await fetch("http://localhost:5000/api/users");

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoadedUsers(responseData.users);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <div className="center">
        <LoadingSpinner />
        </div>}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
