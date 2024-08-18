import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp1.css";

const Signup = () => {
  useEffect(() => {
    // 헤더를 숨깁니다.
    document.querySelector(".nav_wrap").style.display = "none";

    return () => {
      // 컴포넌트가 언마운트될 때 헤더를 다시 보이도록 설정합니다.
      document.querySelector(".nav_wrap").style.display = "flex";
    };
  }, []);

  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [isChecked14, setIsChecked14] = useState(false);
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedPrivacy, setIsCheckedPrivacy] = useState(false);
  const [isCheckedMaketing, setisCheckedMaketing] = useState(false);

  const handleCheckAll = () => {
    const newValue = !isCheckedAll;
    setIsCheckedAll(newValue);
    setIsChecked14(newValue);
    setIsCheckedTerms(newValue);
    setIsCheckedPrivacy(newValue);
    setisCheckedMaketing(newValue);
  };

  const handleIndividualCheck = (setter, value) => {
    setter(!value);
    if (isChecked14 && isCheckedTerms && isCheckedPrivacy && !value) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
  };

  const isButtonActive = isChecked14 && isCheckedTerms && isCheckedPrivacy;

  return (
    <div className="signup_1">
      <div className="signup_box_1">
        <h2>Movie Talk 통합회원 가입 안내</h2>
        <div className="info_text">
          <p>Movie Talk 통합회원 가입을 환영합니다.</p>
          <p>
            웹사이트로 가입하시면 Movie Talk에서 운영하는 다양한 이벤트와 회원
            간 소통을 이용하실 수 있습니다.
          </p>
          <h3>영화관 사이트</h3>
          <p>CGV: www.cgv.co.kr</p>
          <p>롯데시네마: www.lottecinema.co.kr</p>
          <p>메가박스: www.megabox.co.kr</p>
        </div>
        <div className="terms">
          <span className="font_bold">Movie Talk 통합회원 가입</span>
          <span>
            을 위해<br></br> 아래 약관에 동의해주세요.
          </span>
          <div className="checkbox_group">
            <label>
              <input
                type="checkbox"
                checked={isCheckedAll}
                onChange={handleCheckAll}
              />
              약관 전체 동의
            </label>
            <div className="divider"></div>
            <label>
              <input
                type="checkbox"
                checked={isChecked14}
                onChange={() =>
                  handleIndividualCheck(setIsChecked14, isChecked14)
                }
              />
              만 14세 이상 가입 동의<span> (필수)</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={isCheckedTerms}
                onChange={() =>
                  handleIndividualCheck(setIsCheckedTerms, isCheckedTerms)
                }
              />
              이용약관 동의<span> (필수)</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={isCheckedPrivacy}
                onChange={() =>
                  handleIndividualCheck(setIsCheckedPrivacy, isCheckedPrivacy)
                }
              />
              개인정보 수집·이용 동의<span> (필수)</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={isCheckedMaketing}
                onChange={() =>
                  handleIndividualCheck(setisCheckedMaketing, isCheckedMaketing)
                }
              />
              마케팅 정보 수신 동의<span> (선택)</span>
            </label>
          </div>
          <Link to="/SignUp2">
            <button
              className={`signup_1_button ${isButtonActive ? "active" : ""}`}
              disabled={!isButtonActive}
            >
              회원가입 하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
