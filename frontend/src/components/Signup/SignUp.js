import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";
import "./SignUp.css";

const SignUp = () => {
  useEffect(() => {
    const navWrap = document.querySelector(".nav_wrap");
    if (navWrap) {
      navWrap.style.display = "none";
    }

    return () => {
      if (navWrap) {
        navWrap.style.display = "flex";
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    userId: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [errors, setErrors] = useState({
    passwordMismatch: false,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" || name === "confirmPassword") {
      setErrors({
        ...errors,
        passwordMismatch:
          name === "confirmPassword" && formData.password !== value,
      });
    }
  };

  const handleLoginClick2 = () => {
    navigate("/login"); // navigate 사용
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, passwordMismatch: true });
      setMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      await AuthService.registerUser(formData);
      setMessage("User registered successfully");
      navigate("/Login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error registering user";
      console.error(error);
      setMessage(errorMessage);
    }
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every((value) => value.trim() !== "") &&
      !errors.passwordMismatch
    );
  };

  return (
    <div className="signup_2">
      <div className="signup_box_2">
        <h3>계정 정보 입력</h3>
        <p>고객님이 사용하실 계정 정보를 입력해주세요.</p>
        <div className="signup_info">
          <form onSubmit={handleSubmit}>
            <div>
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>핸드폰번호</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>아이디</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디를 입력해주세요."
                required
              />
            </div>
            <div>
              <label>비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.passwordMismatch && (
                <div className="error">비밀번호가 일치하지 않습니다</div>
              )}
            </div>
            <div>
              <label>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력해주세요."
                required
              />
            </div>
            <button
              type="submit"
              className={isFormValid() ? "active" : ""}
              disabled={!isFormValid()}
            >
              통합 회원가입
            </button>
          </form>
          {message && <p>{message}</p>}

          <button onClick={handleLoginClick2}>로그인 페이지로 이동</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
