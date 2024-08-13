import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TermsOfUse from "./components/Signup/TermsOfUse";
import SignUp from "./components/Signup/SignUp";
import Notice from "./components/Notice/Notice";
import WritePost from "./components/Post/WritePost";
import PostDetail from "./components/Post/PostDetail";
import { PostProvider } from "./components/context/PostContext";

import Layout from "./components/Layout";
import Login from "./components/Login/Login";
import MainForm from "./components/Main/MainForm";
import SideBar from "./components/SideBar/SideBar";

function App() {
  return (
    <PostProvider>
      <Router>
        <SideBar />
        <Layout>
          <Routes>
            <Route path="/signup" element={<TermsOfUse />} />
            <Route path="/signup2" element={<SignUp />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/writepost" element={<WritePost />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/" element={<MainForm />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </PostProvider>
  );
}

export default App;
