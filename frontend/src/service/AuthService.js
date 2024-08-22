import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

class AuthService {
  async registerUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "회원가입 중 오류가 발생했습니다.";
    }
  }

  async validateToken(token) {
    try {
      const response = await axios.post(
        `${API_URL}/validateToken`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "토큰 검증 중 오류가 발생했습니다.";
    }
  }

  // 로그인
  async loginUser(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.headers.authorization) {  // 토큰을 헤더에서 가져옴
        localStorage.setItem("user", JSON.stringify(response.data)); // 사용자 정보 저장
        localStorage.setItem("token", response.headers.authorization.split(' ')[1]); // 토큰 저장
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || "로그인 중 오류가 발생했습니다.";
    }
  }

  // 로그아웃
  logoutUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");  // 토큰 삭제
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
