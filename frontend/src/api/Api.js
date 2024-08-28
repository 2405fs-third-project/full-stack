import axios from "axios";

export const apiUrl = process.env.REACT_APP_API_URL;

const API_URL = "http://13.125.98.63:8080/api/posts";

export const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPost = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(API_URL, postData);
  return response.data;
};

export const updatePost = async (updatedPost) => {
  const response = await axios.put(
    `${API_URL}/modify/${updatedPost.id}`,
    updatedPost
  );
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/delete/${id}`);
};

export const updateRecommendation = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/like`);
  return response.data;
};

export const decreaseRecommendation = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/dislike`);
  return response.data;
};

export const addComment = async (postId, userId, comment) => {
  const response = await axios.post(`${API_URL}/${postId}/comments`, {
    user_id: userId,
    reply_content: comment,
    reply_create: new Date().toISOString(),
  });
  return response.data;
};

export const updateComment = async (postId, commentId, newComment) => {
  const response = await axios.put(
    `${API_URL}/${postId}/comments/${commentId}`,
    {
      reply_content: newComment,
    }
  );
  return response.data;
};

export const deleteComment = async (postId, commentId) => {
  await axios.delete(`${API_URL}/${postId}/comments/${commentId}`);
};

export const incrementViews = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/views`);
  return response.data;
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/user/login`, credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token); // 토큰 저장
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error("서버 응답 오류:", error.response.data);
  } else if (error.request) {
    console.error("네트워크 오류:", error.request);
  } else {
    console.error("로그인 처리 중 오류:", error.message);
  }
  throw error;
};

// 모든 API 요청 시 토큰을 헤더에 포함
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);