import React from "react";
import { useLocation } from "react-router-dom";
import SideBar from './SideBar/SideBar';
import Header from './Header/Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderAndSidebar = location.pathname === "/login";

  return (
    <div>
      {!hideHeaderAndSidebar && (
        <>
          <SideBar />
          <Header />
        </>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Layout;