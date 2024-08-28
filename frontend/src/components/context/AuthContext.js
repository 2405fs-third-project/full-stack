import axios from "axios";
import { apiUrl } from "../../api/Api";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const verifyToken = useCallback(async (token) => {
    try {
      // 헤더에 토큰을 포함하여 서버 측으로 요청
      const response = await axios.get(`${apiUrl}/user/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        // 서버에서 받은 새로운 토큰을 저장하고, 사용자 데이터를 업데이트
        const newToken = response.headers["authorization"]?.split(" ")[1];
        if (newToken) {
          localStorage.setItem("token", newToken); // 새로운 토큰을 로컬 스토리지에 저장
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`; // 기본 헤더에 새 토큰 설정
          setUser(response.data.user); // 사용자 정보 저장
        }
      } else {
        logout(); // 유효하지 않은 토큰이라면 로그아웃 처리
      }
    } catch (error) {
      console.error("토큰 검증 오류:", error);
      logout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // 로그인 시 기본 헤더에 JWT 토큰 추가 (추가)
      verifyToken(token);
    }
  }, [verifyToken]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // 기본 헤더에 JWT 토큰 추가
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"]; // 로그아웃 시 토큰 제거
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;