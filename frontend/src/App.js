import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/SignUp1";
import Signup2 from "./components/Signup/SignUp2";
import Notice from "./components/Notice/Notice";
import WritePost from "./components/Post/WritePost";
import PostDetail from "./components/Post/PostDetail";
import { PostProvider } from "./components/context/PostContext";
import { AuthProvider, useAuth } from "./components/context/AuthContext";

import Layout from "./components/Layout";
import Login from "./components/Login/Login";
import MainForm from "./components/Main/MainForm";
import SideBar from "./components/SideBar/SideBar";

function AppContent() {
  const { login } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
  }, [login]);

  // API URL 로그 확인을 위해 추가
  console.log("API URL:", process.env.REACT_APP_API_URL);

  return (
    <Router>
      <SideBar />
      <Layout>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup2" element={<Signup2 />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/writepost" element={<WritePost />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/" element={<MainForm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <AppContent />
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
