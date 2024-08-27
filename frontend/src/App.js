import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Notice from "./components/Notice/Notice";
import Notice2 from "./components/Notice/Notice";
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
              <Route path="/notice2" element={<Notice2 />} />
              <Route path="/writepost" element={<WritePost />} />
              <Route path="/post/:postId" element={<PostDetail />} />
              <Route path="/" element={<MainForm />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
