import React, { useEffect, useState } from "react";
import "./MyPage.css";
import Gauge from "./Gauge";

// 아직 회원 정보 수정란, 작성글, 작성 댓글 확인란은 미완성

// const fetchGaugeValue = async () => {
//   try {
//     const response = await fetch("https://api.example.com/gauge-value");
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return data.value;
//   } catch (error) {
//     console.error("Failed to fetch gauge value", error);
//     return 0;
//   }
// };

// const MyPage = () => {
//   const [gaugeValue, setGaugeValue] = useState(0);

//   useEffect(() => {
//     const loadGaugeValue = async () => {
//       const value = await fetchGaugeValue();
//       setGaugeValue(value);
//     };

//     loadGaugeValue();
//   }, []);

// 백엔드 연결 전 콘솔 로그로 직접 확인을 위한 작업 -> 75라고 찍히면 맞음
// 백엔드 연결을 하면 위에 각주 단 코드 사용, 본 코드는 지워도 무방
const fetchGaugeValue = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(75), 1000));
};

const MyPage = () => {
  const [gaugeValue, setGaugeValue] = useState(0);

  useEffect(() => {
    const loadGaugeValue = async () => {
      const value = await fetchGaugeValue();
      console.log("Fetched gauge value:", value);
      setGaugeValue(value);
    };

    loadGaugeValue();
  }, []);

  return (
    <div className="my_page">
      <div className="header">
        <div className="my_page_title">회원 페이지</div>
      </div>
      <div className="content">
        <main>
          <div className="info">
            <div className="mp_info">
              <div className="info_profile">회원 정보</div>
              <div className="photo">
                <span className="info_photo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="info_photo_check"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </span>
                <div className="mp_profile">
                  <div className="photo_nickname">닉네임</div>
                  <div className="grade">등급</div>
                </div>
              </div>
              <div className="my_profile_all">
                <div className="my_profile">
                  <div className="id">
                    <div className="info_id">아이디</div>
                  </div>
                  <div className="name">
                    <div className="info_name">이름</div>
                  </div>
                  <div className="nickname">
                    <div className="info_nickname">닉네임</div>
                  </div>
                  <div className="email">
                    <div className="info_email">이메일</div>
                  </div>
                  <div className="phone">
                    <div className="info_phone">전화번호</div>
                  </div>
                </div>
                <div className="my_profile_check">
                  <div className="id">
                    <div className="info_id_check">s</div>
                  </div>
                  <div className="name">
                    <div className="info_name_check">a</div>
                  </div>
                  <div className="nickname">
                    <div className="info_nickname_check">asdf</div>
                  </div>
                  <div className="email">
                    <div className="info_email_check">123</div>
                  </div>
                  <div className="phone">
                    <div className="info_phone_check">3456</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="grade_processivity">
          <div className="grade_info">
            <div className="grade_profile">
              <div className="grade_nickname">닉네임란</div>
              <div className="logout">로그아웃란</div>
            </div>
            <div className="grade_photo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="grade_photo_check"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          </div>
          <div className="grade_process">
            <Gauge value={gaugeValue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
