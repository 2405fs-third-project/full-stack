import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/SignUp1";
import Signup2 from "./components/Signup/SignUp2";
import Notice from "./components/Notice/Notice";
import WritePost from "./components/Post/WritePost";
import PostDetail from "./components/Post/PostDetail";
import { PostProvider } from "./components/context/PostContext";

import Layout from "./components/Layout";
import Login from "./components/Login/Login";
import MainForm from "./components/Main/MainForm";
import SideBar from "./components/SideBar/SideBar";
import MyPage from "./components/MyPage/MyPage";

function App() {
  return (
    <PostProvider>
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
            <Route path="login" element={<Login />} />
            <Route path="mypage" element={<MyPage />} />
          </Routes>
        </Layout>
      </Router>
    </PostProvider>
  );
}

export default App;
