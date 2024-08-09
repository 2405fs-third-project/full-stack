import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { createPost } from "../../api/Api"; // 올바른 경로로 수정
import "./WritePost.css";

const WritePost = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
    title: "",
    content: "",
    tab: "잡담", // 탭 선택에 대한 초기값 설정
    image: null, // 이미지 파일 초기값 설정
  });
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title: formData.title,
      content: formData.content,
      author: "익명",
      type: formData.tab, // 선택된 탭을 반영
      date: new Date().toISOString().split("T")[0],
      views: 0,
      recommendations: 0,
      image: formData.image, // 이미지 파일 추가
    };

    try {
      await createPost(newPost);
      navigate("/notice");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCancel = () => {
    console.log("Form canceled");
  };

  return (
    <div className="write-post-container">
      <form onSubmit={handleSubmit} className="write-post-form">
        <div className="form-group row">
          <div className="form-group half">
            <label htmlFor="tab">탭</label>
            <select
              id="tab"
              name="tab"
              value={formData.tab}
              onChange={handleChange}
            >
              <option value="잡담">잡담</option>
              <option value="추천">추천</option>
            </select>
          </div>
          <div className="form-group half">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">이미지 첨부</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="file-upload-instructions">
          허용 확장자: *.jpg; *.jpeg; *.gif; *.png; *.mp4; *.mov; *.webm; *.ogv;
          *.webp; *.bmp; *.tiff; *.heic; *.avi; *.mkv; *.wmv; *.asf
          <br />
          파일당 최대 용량: 500.0MB, 총 50MB.
        </div>
        <div className="file-upload-rules">
          사진, 움짤, 동영상 등 파일 첨부 <br />
          .mp4, .webm, .mov, .webp 는 총 12개 까지 첨부 가능 <br />
          .mp4, .webm, .mov, .webp 는 파일당 40MB 까지 업로드 가능 <br />
          11MB~40MB 움짤은 11MB 이하로 자동변환됨 <br />
          동영상 및 움짤/동영상 45초 이내 길이만 가능, 쪼개서 올릴 경우 무통보
          삭제 가능 <br />
          여기에 파일을 끌어 놓거나 파일 첨부 버튼을 클릭하세요.
        </div>
        <div className="options">
          <label>
            <input type="checkbox" name="퍼가기 금지" /> 퍼가기 금지
          </label>
          <label>
            <input type="checkbox" name="댓글 허용" /> 댓글 허용
          </label>
          <label>
            <input type="checkbox" name="알림 안 받기" /> 알림 안 받기
          </label>
          <label>
            <input type="checkbox" name="외부검색" /> 외부검색
          </label>
        </div>
        <div className="form-buttons">
          <Link to="/notice">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              돌아가기
            </button>
          </Link>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            임시 저장
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            임시 저장 불러오기
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            미리 보기
          </button>
          <button type="submit" className="submit-button">
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
