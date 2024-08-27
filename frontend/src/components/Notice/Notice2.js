import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsByBoardId } from "../../api/Api";
import "./Notice2.css";

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const boardId = 2;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostsByBoardId(boardId);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [boardId]);

  // ID 오름차순으로 정렬
  const sortedPosts = posts.sort((a, b) => a.id - b.id);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return isToday
      ? date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="notice-container">
      <div className="bulletin-board">
        <h2>익명 게시판</h2>
        <table className="post-table">
          <thead>
            <tr>
              <th>ID</th> {/* 여기서 '번호'를 'ID'로 수정 */}
              <th>타입</th>
              <th>제목</th>
              <th>글쓴이</th>
              <th>작성일</th>
              <th>조회</th>
              <th>추천</th>
            </tr>
          </thead>
          <tbody className="post-info">
            {currentPosts.map((post) => {
              return (
                <tr key={post.id}>
                  <td>{post.id}</td> {/* post.id를 표시 */}
                  <td>{post.type}</td>
                  <td>
                    <Link to={`/post/${post.id}`}>{post.postName}</Link>
                  </td>
                  <td>{post.user?.nickname || "익명"}</td>
                  <td>{formatDate(post.postCreate)}</td>
                  <td>{post.views}</td>
                  <td>{post.likes}</td>
                </tr>
              );
            })}
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
