import React, {useState} from "react";
import { Link } from "react-router-dom";

import "./MainNavigation.css";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import Logo from './Logo.svg';

const MainNavigation = (props) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);


    const opendrawerHandler = () => {
        setDrawerIsOpen(true);
    };

    const closedrawerHandler = () => {
        setDrawerIsOpen(false);
    };

    // '{drawerIsOpen && ()' is a special JS expression for the replacement of a ternary (?) operator. It basically means
    // that if drawerIsOpen is true, execute the statement after the &&, the expressions within the ().
  return (
      <React.Fragment>
          {drawerIsOpen && <Backdrop onClick={closedrawerHandler}/>}

      <SideDrawer show={drawerIsOpen} onClick={closedrawerHandler}>
          <nav className="main-navigation__drawer-nav">
              <NavLinks />
          </nav>
      </SideDrawer>

    <MainHeader>
      <button className="main-navigation__menu-btn" onClick={opendrawerHandler}>
        <span />
        <span />
        <span />
      </button>

      <h1 className="main-navigation__title">
        <Link to="/"><div><img className="logo" src={Logo} alt="Logo"/></div></Link>
      </h1>

      <nav className="main-navigation__header-nav">
        <NavLinks />
      </nav>
    </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
