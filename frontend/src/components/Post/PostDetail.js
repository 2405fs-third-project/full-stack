import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPost,
  updateRecommendation,
  decreaseRecommendation,
  deletePost,
  editPost,
  incrementViews,
} from "../../api/Api"; // 올바른 경로로 수정
import "./PostDetail.css";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(postId);
        setPost(data);
        incrementViews(postId);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      navigate("/notice");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(post.content);
  };

  const handleEditSubmit = async () => {
    try {
      await editPost({ ...post, content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setComments([...comments, comment]);
    setComment("");
  };

  const handleCommentEdit = (index) => {
    setEditingCommentIndex(index);
    setEditedComment(comments[index]);
  };

  const handleCommentEditSubmit = (index) => {
    const updatedComments = comments.map((c, i) =>
      i === index ? editedComment : c
    );
    setComments(updatedComments);
    setEditingCommentIndex(null);
    setEditedComment("");
  };

  const handleCommentDelete = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
  };

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span>{post.author}</span> | <span>{post.date}</span> |{" "}
          <span>조회 {post.views}</span> |{" "}
          <span>추천 {post.recommendations}</span>
        </div>
      </div>
      {isEditing ? (
        <div className="post-editing">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleEditSubmit}>수정</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        <div className="post-content">{post.content}</div>
      )}
      <div className="post-botton">
        <div className="post-actions">
          <button onClick={() => updateRecommendation(post.id)}>추천</button>
          <button onClick={() => decreaseRecommendation(post.id)}>
            비추천
          </button>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
        <div className="back-to-notice">
          <button onClick={() => navigate("/notice")}>목록으로</button>
        </div>
      </div>
      <div className="comments-section">
        <h3>댓글</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          ></textarea>
          <button type="submit">등록</button>
        </form>
        <div className="comments-list">
          {comments.map((c, index) => (
            <div key={index} className="comment">
              {editingCommentIndex === index ? (
                <div className="comment-editing">
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                  <button onClick={() => handleCommentEditSubmit(index)}>
                    저장
                  </button>
                  <button onClick={() => setEditingCommentIndex(null)}>
                    취소
                  </button>
                </div>
              ) : (
                <div className="comment-content">
                  {c}
                  <button onClick={() => handleCommentEdit(index)}>수정</button>
                  <button onClick={() => handleCommentDelete(index)}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
