import { Avatar, Button } from "antd";
import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import Logo from "../assets/avatar1.gif";

function AppHeader() {
  const navigate = useNavigate();

  const [avartar, setAvartar] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const username = localStorage.getItem("username");
  const items = [
    {
      key: "1",
      label: <Link to={"/admin/information"}>Thông tin tài khoản</Link>,
    },
    {
      key: "2",
      label: (
        <button
          onClick={handleLogout}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          Đăng xuất
        </button>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 16px",
      }}
    >
      <div>
        <Dropdown menu={{ items }} placement="bottomLeft" arrow>
          <Avatar
            style={{ cursor: "pointer" }}
            size={40}
            src={Logo}
            alt="User Image"
          />
        </Dropdown>

        <span style={{ marginLeft: 16, fontSize: 16, color: "black" }}>
          Xin chào, {username}
        </span>
      </div>
    </div>
  );
}

export default AppHeader;
