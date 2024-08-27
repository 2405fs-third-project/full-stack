import axios from "axios";

export const apiUrl =
  process.env.REACT_APP_API_URL || "http://13.125.98.63:8080/api";
const API_URL = `${apiUrl}/posts`;

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

export const getPostsByBoardId = async (boardId) => {
  try {
    const response = await axios.get(`${API_URL}?boardId=${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (updatedPost) => {
  try {
    const response = await axios.put(
      `${API_URL}/${updatedPost.id}`,
      updatedPost
    );
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const updateRecommendation = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/like`);
    return response.data;
  } catch (error) {
    console.error("Error updating recommendation:", error);
    throw error;
  }
};

export const decreaseRecommendation = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/dislike`);
    return response.data;
  } catch (error) {
    console.error("Error decreasing recommendation:", error);
    throw error;
  }
};

export const addComment = async (postId, userId, comment) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/comments`, {
      user_id: userId,
      reply_content: comment,
      reply_create: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const updateComment = async (postId, commentId, newComment) => {
  try {
    const response = await axios.put(
      `${API_URL}/${postId}/comments/${commentId}`,
      {
        reply_content: newComment,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    await axios.delete(`${API_URL}/${postId}/comments/${commentId}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const incrementViews = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/views`);
    return response.data;
  } catch (error) {
    console.error("Error incrementing views:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/user/login`, credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUserPoints = async (userId, points) => {
  try {
    const response = await axios.post(`${apiUrl}/user/update-points`, {
      userId,
      points,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error("Server response error:", error.response.data);
  } else if (error.request) {
    console.error("Network error:", error.request);
  } else {
    console.error("Error during login:", error.message);
  }
  throw error;
};

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
