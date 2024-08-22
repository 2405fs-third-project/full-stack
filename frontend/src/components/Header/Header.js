import React, { useState } from "react";
import "./Header.css";
import { Navigate, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";

const Header = () => {
  const Navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoginClick = () => {
    Navigate("/login");
  };

  const handleLoginClick2 = () => {
    Navigate("/TermsOfUse");
  };

  const handleSearch = () => {
    console.log("검색어", searchQuery);
    setSearchQuery(""); // 검색 후 입력 값 초기화
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleSearch = () => {
    console.log("검색어", searchQuery);
    setSearchQuery(""); // 검색 후 입력 값 초기화
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="nav_wrap">
      <div className="search">
        <FaSearch style={{ fontSize: "20px" }} />
      </div>

      <div className="nav_center">
        <div className="search_wrap">
          <input
            type="text"
            placeholder="검색하기"
            className="search_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="nav_right">
        <div className="my_page">
          <IoPersonCircleOutline />
        </div>
        <div className="login" onClick={handleLoginClick}>
          로그인
        </div>
        <div className="signup" onClick={handleLoginClick2}>
          회원가입
        </div>
      </div>
    </div>
  );
};

export default Header;
