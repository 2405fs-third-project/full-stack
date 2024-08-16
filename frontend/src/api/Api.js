import axios from "axios";

export const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getPosts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    for (const key in postData) {
      formData.append(key, postData[key]);
    }

    const response = await axios.post(`${apiUrl}/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updateRecommendation = async (id) => {
  try {
    const response = await axios.post(`${apiUrl}/posts/${id}/recommend`);
    return response.data;
  } catch (error) {
    console.error("Error updating recommendation:", error);
    throw error;
  }
};

export const decreaseRecommendation = async (id) => {
  try {
    const response = await axios.post(`${apiUrl}/posts/${id}/derecommend`);
    return response.data;
  } catch (error) {
    console.error("Error decreasing recommendation:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await axios.delete(`${apiUrl}/posts/${id}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const editPost = async (post) => {
  try {
    const response = await axios.put(`${apiUrl}/posts/${post.id}`, post);
    return response.data;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
};

export const incrementViews = async (id) => {
  try {
    const response = await axios.post(`${apiUrl}/posts/${id}/view`);
    return response.data;
  } catch (error) {
    console.error("Error incrementing views:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${apiUrl}/user/login`,
      credentials,
      {
        withCredentials: true, // 필요 시
      }
    );
    const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token); // 토큰 저장
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
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

