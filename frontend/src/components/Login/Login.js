import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate(); // useNavigate 훅을 올바르게 사용
  const { login, user } = useAuth();

  const [emailTouched, setEmailTouched] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [errorMessage, setErrorMessage] = useState(""); // 추가

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailTouched(true);
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i; // 이메일 형식
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePassword = (e) => {
    setPw(e.target.value);
    setPwTouched(true);
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/; // 영문 숫자 조합 8자리 이상
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setSubmitAttempted(true);
    setEmailTouched(true);
    setPwTouched(true);
    setErrorMessage(""); // 추가
    if (!emailValid || !pwValid) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/user/login",
        {
          email: email,
          password: pw,
        },
        {
          withCredentials: true, // CSRF 보호를 위해 쿠키 포함 (추가)
        }
      );
   
      if (response.data.success) {
        // 로그인 성공 처리
        console.log("로그인 성공:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        login(response.data.user, response.data.token); // 사용자 정보를 AuthContext에 설정
        navigate("/");
      } else {
        setErrorMessage(response.data.message || "로그인에 실패했습니다."); // 추가
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMessage(
        error.response?.data?.message || "로그인 중 오류가 발생했습니다."
      ); // 추가
    }
  };

  const handleSignupClick = () => {
    navigate("/signup"); // useNavigate 훅을 사용하여 페이지 이동
  };

  return (
    <div className="login_container">
      <div className="login">
        <h1>로그인</h1>
        <div className="login_title">
          <div className="input_wrap">
            <div className="id_box">아이디</div>
            <input
              type="text"
              className={`input ${
                (emailTouched || submitAttempted) && !emailValid ? "error" : ""
              }`}
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="error_message">
            {(emailTouched || submitAttempted) && !emailValid && (
              <div>이메일을 입력해주세요.</div>
            )}
          </div>

          <div className="pw_box">비밀번호</div>
          <input
            type="password"
            className={`input ${
              (pwTouched || submitAttempted) && !pwValid ? "error" : ""
            }`}
            placeholder="비밀번호를 입력해주세요."
            value={pw}
            onChange={handlePassword}
          />
        </div>
        <div className="error_message">
          {(pwTouched || submitAttempted) && !pwValid && (
            <div>비밀번호를 입력해주세요.</div>
          )}

          {errorMessage && (
            <div className="error_message">
              <div>{errorMessage}</div>
            </div>
          )}
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
