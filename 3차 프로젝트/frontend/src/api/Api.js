import axios from "axios";

const API_URL = "http://localhost:8080/api/posts";

export const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPost = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append("user_id", postData.userId);
  formData.append("post_number", postData.postNumber);
  formData.append("post_name", postData.title);
  formData.append("post_content", postData.content);
  formData.append("views", 0);
  formData.append("likes", 0);
  formData.append("post_create", new Date().toISOString());

  if (postData.image) {
    formData.append("image", postData.image);
  }

  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePost = async (updatedPost) => {
  const response = await axios.put(`${API_URL}/${updatedPost.id}`, {
    post_name: updatedPost.title,
    post_content: updatedPost.content,
  });
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateRecommendation = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/likes`, { amount: 1 });
  return response.data;
};

export const decreaseRecommendation = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/likes`, { amount: -1 });
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
