import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { apiUrl } from "../../api/Api";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user, logout } = useAuth();

  const handleLoginClick = () => {
    if (user) {
      logout();
    } else {
      navigate("/login");
    }
  };

  const handleSignupClick = () => {
    navigate("/TermsOfUse");
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(`${apiUrl}/movies/search`, {
        params: { searchQuery },
      });
      setSearchResults(response.data);
      console.log("검색 결과:", response.data);
    } catch (error) {
      console.error("검색 중 오류 발생", error);
    }
    setSearchQuery("");
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
          {user ? "로그아웃" : "로그인"}
        </div>
        {!user && (
          <div className="signup" onClick={handleSignupClick}>
            회원가입
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="search_results">
          {searchResults.map((result) => (
            <div key={result.id} className="search_result_item">
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
