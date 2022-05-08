import React from "react";
import "./Bar.css";
import brand from "../../assets/Groww-Logo.png";

const Appbar = () => {
  return (
    <nav className="appbar">
      <img src={brand} height="45" width="47" alt="logo" className="logo"/>
    </nav>
  );
};

export default Appbar;
