import React from "react";
import UsersList from "../components/UsersList/UsersList";

const users = () => {
    const USERS =[
        {
        id:'u1',
        name:"Lakshit Rattan",
        image:"https://static01.nyt.com/images/2021/05/25/multimedia/25xp-johncena/25xp-johncena-mobileMasterAt3x.jpg",
        places:4
    }
    ];
  return <UsersList items={USERS}/>;
};

export default users;
