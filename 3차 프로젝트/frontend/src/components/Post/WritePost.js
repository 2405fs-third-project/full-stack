import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/Api";
import "./WritePost.css";

const WritePost = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
    title: "",
    content: "",
    tab: "잡담",
    image: null,
  });

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
    await createPost({
      ...formData,
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      views: 0,
      recommendations: 0,
      comments: [],
    });
    navigate("/notice");
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
            <input type="checkbox" name="댓글 금지" /> 댓글 금지
          </label>
          <label>
            <input type="checkbox" name="알림 안 받기" /> 알림 안 받기
          </label>
          <label>
            <input type="checkbox" name="외부검색" /> 외부검색
          </label>
        </div>
        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/notice")}
          >
            돌아가기
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
