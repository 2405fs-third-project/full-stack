import axios from "axios";
import { default as React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../api/Api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [idTouched, setIdTouched] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);

  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");

  const [userIdValid, setUserIdValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUserId = (e) => {
    setUserId(e.target.value);
    setIdTouched(true);
    const regex = /^[a-zA-Z0-9_]{4,20}$/; // 영문, 숫자, 언더스코어 허용, 4-20자
    if (regex.test(e.target.value)) {
      setUserIdValid(true);
    } else {
      setUserIdValid(false);
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
    setIdTouched(true);
    setPwTouched(true);
    setErrorMessage("");
    if (!userIdValid || !pwValid) {
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/user/login`, {
        userId: userId,
        password: pw,
      });

      if (response.status === 200 || response.status === 201) {
        alert(response.data);
        console.log("로그인 성공:", response.data);
        login(response.data.user, (response.headers["authorization"] || "").split(" ")[1]); // 사용자 정보와 토큰을 AuthContext에 저장
        axios.defaults.headers.common["Authorization"] = `Bearer ${
          (response.headers["authorization"] || "").split(" ")[1]
        }`; // axios 기본 헤더에 토큰 설정

        navigate("/");
      } else {
        alert(response.data);
        setErrorMessage(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMessage(error.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSignupClick = () => {
    navigate("/TermsOfUse"); // useNavigate 훅을 사용하여 페이지 이동
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
              className={`input ${(idTouched || submitAttempted) && !userIdValid ? "error" : ""}`}
              placeholder="아이디를 입력해주세요."
              value={userId}
              onChange={handleUserId}
            />
          </div>
          <div className="error_message">
            {(idTouched || submitAttempted) && !userIdValid && <div>아이디를 입력해주세요.</div>}
          </div>

          <div className="pw_box">비밀번호</div>
          <input
            type="password"
            className={`input ${(pwTouched || submitAttempted) && !pwValid ? "error" : ""}`}
            placeholder="비밀번호를 입력해주세요."
            value={pw}
            onChange={handlePassword}
          />
        </div>
        <div className="error_message">
          {(pwTouched || submitAttempted) && !pwValid && <div>비밀번호를 입력해주세요.</div>}

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