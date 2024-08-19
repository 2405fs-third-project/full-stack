import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate(); // useNavigate 훅을 올바르게 사용

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i; // 이메일 형식
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePassword = (e) => {
    setPw(e.target.value);
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/; // 영문 숫자 조합 8자리 이상
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const handleLogin = () => {
    setSubmitAttempted(true);
    if (!emailValid || !pwValid) {
      // 로그인 로직이 실행되지 않도록 유효성 검사에 실패한 경우 종료
      return;
    }
    // 로그인 로직 실행
  };

  const handleSignupClick = () => {
    navigate("/TermsOfUse"); // useNavigate 훅을 사용하여 페이지 이동
  };

  return (
    <div className="login_container">
      <div className="login">
        <h1>Movie Talk</h1>
        <div className="login_title">
          <div className="input_wrap">
            <div className="id_box">아이디</div>
            <input
              type="text"
              className={`input ${
                (!emailValid && submitAttempted) ||
                (email.length > 0 && !emailValid)
                  ? "error"
                  : ""
              }`}
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="error_message">
            {!emailValid && submitAttempted && (
              <div>이메일을 입력해주세요.</div>
            )}
          </div>

          <div className="pw_box">비밀번호</div>
          <input
            type="password"
            className={`input ${
              (!pwValid && submitAttempted) || (pw.length > 0 && !pwValid)
                ? "error"
                : ""
            }`}
            placeholder="비밀번호를 입력해주세요."
            value={pw}
            onChange={handlePassword}
          />
        </div>
        <div className="error_message">
          {!pwValid && submitAttempted && <div>비밀번호를 입력해주세요.</div>}
        </div>

        <div className="btn_wrap">
          <button className="login_btn" onClick={handleLogin}>
            로그인
          </button>

          <button className="signup_btn" onClick={handleSignupClick}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
