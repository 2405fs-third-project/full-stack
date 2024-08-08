import React from "react";
import "./Notice.css";
import { Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";

const Notice = () => {
  const { posts } = usePosts();

  const postList = Array.isArray(posts) ? posts : [];

  return (
    <div className="notice-container">
      <div className="bulletin-board">
        <h2>익명 게시판</h2>
        <table className="post-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>타입</th>
              <th>제목</th>
              <th>글쓴이</th>
              <th>작성일</th>
              <th>조회</th>
              <th>추천</th>
            </tr>
          </thead>
          <tbody>
            {postList.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>{post.type}</td>
                <td>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
                <td>{post.recommendations}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="actions">
          <Link to="/writepost">
            <button className="write-button">글쓰기</button>
          </Link>
        </div>
        <div className="pagination">
          <button className="page-button">1</button>
          <button className="page-button">2</button>
          <button className="page-button">3</button>
          <button className="page-button">4</button>
        </div>
        <div className="search-container">
          <select className="search-select">
            <option value="title+content">제목+내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">글쓴이</option>
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="검색어 입력"
          />
          <button className="search-button">검색</button>
        </div>
      </div>
    </div>
  );
};

export default Notice;
