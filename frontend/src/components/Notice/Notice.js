import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../api/Api"; // 경로 수정

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data); // 최신 게시물이 가장 높은 번호로 되어있음
    };

    fetchPosts();
  }, []);

  // 게시물들을 역순으로 나눈다.
  const reversedPosts = [...posts].reverse();

  // 현재 페이지의 게시물들만 추출
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reversedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <tbody className="post-info">
            {currentPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.tab}</td>
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
        <div className="pagination">
          {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(
            (number) => (
              <button key={number + 1} onClick={() => paginate(number + 1)}>
                {number + 1}
              </button>
            )
          )}
        </div>
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
