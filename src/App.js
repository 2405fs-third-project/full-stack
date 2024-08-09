import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./components/Login/Login";
import MainForm from "./components/Main/MainForm";
import SideBar from "./components/SideBar/SideBar";

function App() {
  return (
    <Router>
      <SideBar />
      <Layout>
        <Routes>
          <Route path="/" element={<MainForm />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
