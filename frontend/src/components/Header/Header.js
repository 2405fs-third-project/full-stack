import React from "react";
import "./Header.css";
import { Navigate, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";

const Header = () => {
  const Navigate = useNavigate();

  const handleLoginClick = () => {
    Navigate("/login");
  };
  return (
    <div className="nav_wrap">
      <div className="search">
        <FaSearch style={{ fontSize: "20px" }}/>
      </div>

      <div className="nav_center">
        <div className="search_wrap">
          <input
            type="text"
            placeholder="검색하기"
            className="search_input"
          />
        </div>
      </div>

      <div className="nav_right">
        <div className="my_page"><IoPersonCircleOutline /></div>
        <div className="login" onClick={handleLoginClick}>
          로그인
        </div>
        <div className="signup">회원가입</div>
      </div>
    </div>
  );
};

export default Header;