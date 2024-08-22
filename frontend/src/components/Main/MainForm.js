import React from "react";
import "./MainForm.css";
import { useNavigate } from "react-router-dom";

const MainForm = () => {
  const navigate = useNavigate();

  const handleClick = {
    // 일단 login으로 연결
    community: () => navigate("/login"), 
    movie: () => navigate("/login"),
    recommend: () => navigate("/login"),
  };

  return (
    <div className="main_wrap">
      <div className="board1">
        <h2 onClick={handleClick.community}>익명 게시판</h2>
        <div className="box1"></div>
      </div>
      <div className="board_container">
        <div className="board2">
          <h3 onClick={handleClick.movie}>현재상영작</h3>
          <div className="box2"></div>
        </div>
        <div className="board3">
          <h3 onClick={handleClick.recommend}>영화 추천</h3>
          <div className="box3"></div>
        </div>
      </div>
    </div>
  );
};

export default MainForm;
