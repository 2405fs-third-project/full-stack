let posts = []; // 로컬에서 관리할 게시물 데이터
let postCounter = 1; // 게시글 번호 카운터

// 모든 게시물 가져오기
export const getPosts = async () => {
  return posts;
};

// 특정 게시물 가져오기
export const getPost = async (id) => {
  return posts.find((post) => post.id === id);
};

// 게시물 생성
export const createPost = async (postData) => {
  const newPost = {
    ...postData,
    id: postCounter++, // 고유 번호를 부여하고 카운터를 증가
    views: 0,
    recommendations: 0,
    comments: [],
  };
  posts = [...posts, newPost];
  return newPost;
};

// 게시물 수정
export const updatePost = async (updatedPost) => {
  posts = posts.map((post) =>
    post.id === updatedPost.id ? updatedPost : post
  );
  return updatedPost;
};

// 게시물 삭제
export const deletePost = async (id) => {
  posts = posts.filter((post) => post.id !== id);
};

// 추천수 증가/감소
const modifyRecommendation = (id, amount) => {
  posts = posts.map((post) =>
    post.id === id
      ? { ...post, recommendations: post.recommendations + amount }
      : post
  );
};

export const updateRecommendation = async (id) => {
  modifyRecommendation(id, 1);
};

export const decreaseRecommendation = async (id) => {
  modifyRecommendation(id, -1);
};

// 댓글 추가
export const addComment = async (postId, comment) => {
  posts = posts.map((post) =>
    post.id === postId
      ? { ...post, comments: [...post.comments, comment] }
      : post
  );
};

// 댓글 수정
export const updateComment = async (postId, commentIndex, newComment) => {
  posts = posts.map((post) =>
    post.id === postId
      ? {
          ...post,
          comments: post.comments.map((c, index) =>
            index === commentIndex ? newComment : c
          ),
        }
      : post
  );
};

// 댓글 삭제
export const deleteComment = async (postId, commentIndex) => {
  posts = posts.map((post) =>
    post.id === postId
      ? {
          ...post,
          comments: post.comments.filter((_, index) => index !== commentIndex),
        }
      : post
  );
};

// 조회수 증가
export const incrementViews = async (id) => {
  posts = posts.map((post) =>
    post.id === id ? { ...post, views: post.views + 1 } : post
  );
  return posts.find((post) => post.id === id);
};
