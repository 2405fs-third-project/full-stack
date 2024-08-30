import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../api/Api";
import "./MainForm.css";

// 게시판
const fetchAnonymousBoard = async () => {
  try {
    const response = await axios.get(`${apiUrl}/posts/all`);
    return response.data.slice(0, 7);
  } catch (error) {
    console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 현재 상영작
const fetchCurrentMovies = async () => {
  try {
    const response = await axios.get(`${apiUrl}/movies/current`);
    return response.data.slice(0, 7);
  } catch (error) {
    console.error("현재상영작 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 추천 영화
const fetchRecommendedMovies = async () => {
  try {
    const response = await axios.post(`${apiUrl}/movies/recommend`, {}); // 빈 객체로 POST 요청
    return response.data.slice(0, 7);
  } catch (error) {
    console.error("추천 영화 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
};

const MainForm = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [anonymousBoard, setAnonymousBoard] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  useEffect(() => {
    fetchAnonymousBoard().then((data) => {
      console.log("게시판 데이터:", data);
      setAnonymousBoard(data);
    });
    fetchCurrentMovies().then((data) => {
      console.log("현재 상영작 데이터:", data);
      setCurrentMovies(data);
    });
    fetchRecommendedMovies().then((data) => {
      console.log("추천 영화 데이터:", data);
      setRecommendedMovies(data);
    });
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="main_wrap">
      <div className="board1">
        <h2>게시판</h2>
        <div className="box1">
          {anonymousBoard.map((post, index) => (
            <div key={post.id} onClick={() => handlePostClick(post.id)}>
              {post.postName}
            </div>
          ))}
        </div>
      </div>
      <div className="board_container">
        <div className="board2">
          <h3>현재 상영작</h3>
          <div className="box2">
            {currentMovies.map((movie, index) => (
              <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                {index + 1}. {movie.movieName}
              </div>
            ))}
          </div>
        </div>
        <div className="board3">
          <h3>추천 영화</h3>
          <div className="box3">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                {movie.movieName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainForm;
