import React, { createContext, useContext, useState } from "react";

const PostContext = createContext();

export const usePosts = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    // 초기 게시글 데이터
  ]);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [
      ...prevPosts,
      { ...newPost, id: prevPosts.length + 1 },
    ]);
  };

  const updateRecommendation = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, recommendations: post.recommendations + 1 }
          : post
      )
    );
  };

  const decreaseRecommendation = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, recommendations: post.recommendations - 1 }
          : post
      )
    );
  };

  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const editPost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const incrementViews = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, views: post.views + 1 } : post
      )
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        updateRecommendation,
        decreaseRecommendation,
        deletePost,
        editPost,
        incrementViews,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
