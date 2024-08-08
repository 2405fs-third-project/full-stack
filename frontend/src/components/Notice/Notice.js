import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../api/Api"; // 올바른 경로로 수정
import "./Notice.css";

const Notice = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        // 데이터가 배열인지 확인하고 배열이 아닌 경우 빈 배열로 초기화
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]); // 에러가 발생할 경우 빈 배열로 초기화
      }
    };

    fetchPosts();
  }, []);

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
            {posts.map((post, index) => (
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
      </div>
    </div>
  );
};

export default Notice;
