import React from "react";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";

import cinema from "../../assets/Cinema.png";
import { AiOutlineHome } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { TbMovie } from "react-icons/tb";
import { SiThemoviedatabase } from "react-icons/si";

const NavBar = () => {
  const Navigate = useNavigate();

  const handleHomeClick = () => {
    Navigate("/");
  };

  const handleHomeClick2 = () => {
    Navigate("/notice");
  };

  return (
    <div className="sidebar_wrap">
      <div className="logo">
        <img src={cinema} className="main_logo" alt="main_logo" />
      </div>
      <div className="sidebar_center">
        <div className="sidebar_item" onClick={handleHomeClick}>
          <AiOutlineHome className="icon" />
          <div className="label">HOME</div>
        </div>
        <div className="sidebar_item">
          <BsChatSquareText className="icon" onClick={handleHomeClick2} />
          <div className="label">COMMUNITY</div>
        </div>
        <div className="sidebar_item">
          <TbMovie className="icon" />
          <div className="label">MOVIE</div>
        </div>
        <div className="sidebar_item">
          <SiThemoviedatabase className="icon" />
          <div className="label">RECOMMEND</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
