import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  //instead of LoggedIn and setIsLoggedIn which were used to maintain the states whether we were logged in or not, we will now use the token functions to validation of token as part of our authorisation.
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  //to avoid infinite loops, dependency set to empty array shows that this object will be create just once.
  //also we not only expect a userid, but also a token for authorisation, which we will manage here
  const login = useCallback((uid, token, expirationDate) => {
    //setting the token to the token recieved and userId to the uid recieved on login
    setToken(token);
    setUserId(uid);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    /*setItem sets a userData named object, which is not an object but we make it using the JSON.stringify method 
    which converts anything inside it into plain text ready to be stored inside the local storage, inside which there is a userId field and also a token 
    Now we can use this local storage data, to retain the logged in user on, even for reloads or browser shutdowns*/
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      }),
    );
  }, []);

  //to avoid infinite loops, dependency set to empty array shows that this object will be create just once.
  const logout = useCallback(() => {
    //clearing both the token and userid to null after logout
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
