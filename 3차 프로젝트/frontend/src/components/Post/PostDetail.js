import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPost,
  updateRecommendation,
  decreaseRecommendation,
  deletePost,
  updatePost,
  addComment,
  deleteComment,
  updateComment,
  incrementViews,
} from "../../api/Api";
import "./PostDetail.css";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [comment, setComment] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // 중복 호출 방지용 플래그
  const hasIncremented = useRef(true);

  useEffect(() => {
    const fetchPost = async (id) => {
      try {
        if (!hasIncremented.current) {
          await incrementViews(id); // 조회수 1 증가
          hasIncremented.current = true; // 조회수 증가 플래그 설정
        }
        const data = await getPost(id);
        setPost(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost(Number(postId));

    // 컴포넌트 언마운트 시 플래그를 리셋
    return () => {
      hasIncremented.current = false;
    };
  }, [postId]);

  const handleRecommendation = async (type) => {
    try {
      if (type === "increase") {
        await updateRecommendation(post.id);
      } else {
        await decreaseRecommendation(post.id);
      }
      const updatedPost = await getPost(post.id);
      setPost(updatedPost);
    } catch (error) {
      console.error("Error updating recommendation:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      navigate("/notice");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updatePost({ ...post, title: editedTitle, content: editedContent });
      setIsEditing(false);
      setPost({ ...post, title: editedTitle, content: editedContent });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(post.id, comment);
      const updatedPost = await getPost(post.id);
      setPost(updatedPost);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (index) => {
    try {
      await deleteComment(post.id, index);
      const updatedPost = await getPost(post.id);
      setPost(updatedPost);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (index) => {
    setEditingCommentIndex(index);
    setEditedComment(post.comments[index]);
  };

  const handleEditCommentSubmit = async (index) => {
    try {
      await updateComment(post.id, index, editedComment);
      const updatedPost = await getPost(post.id);
      setPost(updatedPost);
      setEditingCommentIndex(null);
      setEditedComment("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-detail-wrapper">
      <div className="post-detail-container">
        <div className="post-header">
          <h2>
            {isEditing ? (
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              post.title
            )}
          </h2>
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
            <button onClick={handleEditSubmit}>수정 완료</button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        ) : (
          <div className="post-content">
            {post.image && (
              <img
                src={URL.createObjectURL(post.image)}
                alt="Attached"
                className="post-image"
              />
            )}
            <div>{post.content}</div>
          </div>
        )}
        <div className="post-bottom">
          <div className="post-actions">
            <button onClick={() => handleRecommendation("increase")}>
              추천
            </button>
            <button onClick={() => handleRecommendation("decrease")}>
              비추천
            </button>
            <button onClick={() => setIsEditing(true)}>수정</button>
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
            {post.comments.map((c, index) => (
              <div key={index} className="comment">
                <div className="comment-author">{post.author}</div>
                {editingCommentIndex === index ? (
                  <div className="edit-box">
                    <textarea
                      className="comment-edit-textarea"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <button onClick={() => handleEditCommentSubmit(index)}>
                      수정 완료
                    </button>
                    <button onClick={() => setEditingCommentIndex(null)}>
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="comment-box">
                    <div className="comment-content">{c}</div>
                    <div className="edit-comment">
                      <button onClick={() => handleEditComment(index)}>
                        수정
                      </button>
                      <button onClick={() => handleDeleteComment(index)}>
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
