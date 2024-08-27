import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainForm.css";

const API_URL = "http://localhost:8080/api/posts";

// 토큰을 포함한 API 요청 함수
const fetchBoardData = async (boardType) => {
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기

  try {
    const response = await axios.get(`${API_URL}/${boardType}`, {
      headers: { Authorization: `Bearer ${token}` }, // 토큰 포함
    });
    return response.data;
  } catch (error) {
    console.error(`${boardType} 데이터를 가져오는 중 오류 발생:`, error);
    if (error.response && error.response.status === 401) {
      console.error("인증 오류: 로그인이 필요합니다.");
    }
    return [];
  }
};

const MainForm = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [anonymousBoard, setAnonymousBoard] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchBoardData("anonymousBoard").then((data) => setAnonymousBoard(data));
    fetchBoardData("currentMovies").then((data) => setCurrentMovies(data));
    fetchBoardData("recommendedMovies").then((data) =>
      setRecommendedMovies(data)
    );
  }, []);

  const handleClick = {
    // 로그인이 되어있지 않다면 로그인 페이지로 리다이렉트
    community: () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      } else {
        // 실제 커뮤니티 페이지로 이동하는 코드 추가
      }
    },
    movie: () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      } else {
        // 실제 영화 페이지로 이동하는 코드 추가
      }
    },
    recommend: () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      } else {
        // 실제 추천 페이지로 이동하는 코드 추가
      }
    },
  };

  return (
    <div className="main_wrap">
      <div className="board1">
        <h2 onClick={handleClick.community}>익명 게시판</h2>
        <div className="box1">
          {anonymousBoard.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      </div>
      <div className="board_container">
        <div className="board2">
          <h3 onClick={handleClick.movie}>현재상영작</h3>
          <div className="box2">
            {currentMovies.map((movie) => (
              <div key={movie.id}>{movie.title}</div>
            ))}
          </div>
        </div>
        <div className="board3">
          <h3 onClick={handleClick.recommend}>영화 추천</h3>
          <div className="box3">
            {recommendedMovies.map((movie) => (
              <div key={movie.id}>{movie.title}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainForm;
