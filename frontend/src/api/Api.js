import axios from "axios";

export const apiUrl = process.env.REACT_APP_API_URL;

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
