import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

class AuthService {
  // 회원가입
  async registerUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "회원가입 중 오류가 발생했습니다.";
    }
  }

  // 토큰 검증
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
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || "로그인 중 오류가 발생했습니다.";
    }
  }

  // 로그아웃
  logoutUser() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
