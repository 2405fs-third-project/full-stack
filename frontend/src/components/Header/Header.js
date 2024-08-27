import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { apiUrl } from "../../api/Api";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태 추가

  const handleLoginClick = () => {
    navigate("/login");
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

      if (response.status === 200) {
        setSearchResults(response.data); // 검색 결과 상태 업데이트
        console.log("검색 결과:", response.data);
      } else {
        console.error("검색 중 오류 발생:", response.status);
      }
    } catch (error) {
      console.error("검색 중 오류 발생", error);
    }
    setSearchQuery(""); // 검색 후 입력 값 초기화
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleResultClick = (movieId) => {
    // 영화 상세 페이지로 이동
    navigate(`/movies/${movieId}`);
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
        <div className="signup" onClick={handleSignupClick}>
          회원가입
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="search_results">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="search_result_item"
              onClick={() => handleResultClick(result.id)} // 클릭 시 영화 상세 페이지로 이동
            >
              {result.movieName} - {result.movieGenre} - {result.movieDirector}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
