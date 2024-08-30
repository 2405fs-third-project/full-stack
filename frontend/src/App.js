import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Notice from "./components/Notice/Notice";
import PostDetail from "./components/Post/PostDetail";
import WritePost from "./components/Post/WritePost";
import Signup from "./components/Signup/SignUp";
import TermsOfUse from "./components/Signup/TermsOfUse";
import { PostProvider } from "./components/context/PostContext";

import Layout from "./components/Layout";
import Login from "./components/Login/Login";
import MainForm from "./components/Main/MainForm";
import SideBar from "./components/SideBar/SideBar";
import { AuthProvider } from "./components/context/AuthContext";
import MyPage from "./components/MyPage/MyPage";
import Movie from "./components/Movie/Movie";
import Recommendation from "./components/Movie/Recommendation";

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <SideBar />
          <Layout>
            <Routes>
              <Route path="/TermsOfUse" element={<TermsOfUse />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/writepost" element={<WritePost />} />
              <Route path="/post/:postId" element={<PostDetail />} />
              <Route path="/" element={<MainForm />} />
              <Route path="login" element={<Login />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/movie" element={<Movie />} />
              <Route path="/recommendation" element={<Recommendation />} />
            </Routes>
          </Layout>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
