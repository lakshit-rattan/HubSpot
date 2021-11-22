import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  /**DON'T do useEffect(async () =>...). Don't make the fetch request and useEffect in async and await.
   * Although it would work fine, it is a bad coding practice, because it goes against what useEffect expects here. It does not expect back a promise of any type here.
   * but any Asynchronous request always gives back a promise, hence discouraged to do so. Rather it's better to create a separate function for it
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //should be a GET request. with fetch(), the default type is always a GET request
        const responseData = await sendRequest(
          "http://localhost:5000/api/users",
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
