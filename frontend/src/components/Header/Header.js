import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
// import { apiUrl } from "../../api/Api";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/TermsOfUse");
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      // KOFIC API 호출
      const response = await axios.get(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json`,
        {
          params: {
            key: '82ca741a2844c5c180a208137bb92bd7',
            movieNm: searchQuery,
          },
        }
      );

      if (response.status === 200) {
        const results = response.data.movieListResult.movieList;

        if (results.length > 0) {
          setSearchResults(results);
          console.log("검색 결과:", results);
        } else {
          setSearchResults([]);
          console.log("검색 결과가 없습니다.");
        }
      } else {
        console.error("검색 중 오류 발생:", response.status);
      }
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

  const handleResultClick = (movieCd) => {
    navigate(`/movies/${movieCd}`);
    setSearchResults([]);
  };

  const handleClickOutside = (event) => {
    if (
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target)
    ) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    // 문서 전체에 클릭 이벤트를 추가하여 외부 클릭을 감지
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="search_results" ref={searchResultsRef}>
          {searchResults.map((result) => (
            <div
              key={result.movieCd}
              className="search_result_item"
              onClick={() => handleResultClick(result.movieCd)} // 클릭 시 영화 상세 페이지로 이동
            >
              <strong>{result.movieNm}</strong> <br />
              개봉일: {result.openDt} <br />
              감독: {result.directors.map(d => d.peopleNm).join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
