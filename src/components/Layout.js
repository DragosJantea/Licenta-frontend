import React from "react";
import classes from "./Layout.css";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import ChatBox from "./ChatBox";

const Layout = (props) => {
  const { auth, role, logout } = useAuth();

  return (
    <div>
      <Navbar />
      <main className={classes.main}>{props.children}</main>
      {role === "client" && auth && <ChatBox />}
    </div>
  );
};

export default Layout;
