import {
  AppstoreOutlined,
  BankOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  PictureOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme } from "antd";
import AppHeader from "../components/AppHeader";
import AppContent from "../components/AppContent";
import { Link } from "react-router-dom";

import AppLeftHand from "../components/AppLeftHand";
import "../css/DefaultLayout.css";
import axios from "axios";
import config from "../config";
import { useEffect, useState } from "react";

const { Header, Sider, Content, Footer } = Layout;

function DefaultLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [categoryPermissionData, setCategoryPermissionData] = useState([]);

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem(
      <Link to="/">Bảng điều khiển</Link>,
      "1",
      <DashboardOutlined style={{ fontSize: 18 }} />
    ),
    getItem(
      "Thông tin quản trị",
      "2",
      <AppstoreOutlined style={{ fontSize: 18 }} />,
      [
        getItem(<Link to="/admin/information">Thông tin Admin</Link>, "3"),
        getItem(<Link to="/admin">Quản lý tài khoản Admin</Link>, "4"),
        getItem(<Link to="/admin/add">Thêm tài khoản Admin</Link>, "5"),
      ],
      "admin"
    ),
    getItem(
      "Quản lý sinh viên vay",
      "6",
      <UserOutlined style={{ fontSize: 18 }} />,
      [getItem(<Link to="/student">Thông tin sinh viên</Link>, "7")]
    ),
    getItem(
      "Quản lý doanh nghiệp",
      "8",
      <BankOutlined style={{ fontSize: 18 }} />,
      [
        getItem(<Link to="/sponsor">Quản lý mạnh thường quân</Link>, "9"),
        // getItem(<Link to="/sponsor/tien-gop">Quản lý tiền góp</Link>, "6"),
      ]
    ),
    getItem(
      "Quản lý tin tức",
      "10",
      <FileTextOutlined style={{ fontSize: 18 }} />,
      [
        getItem(<Link to="/news">Quản lý tin tức</Link>, "11"),
        getItem(<Link to="/news/add">Thêm tin tức</Link>, "12"),
      ]
    ),
    getItem(
      "Quản lý trang chủ",
      "13",
      <FileTextOutlined style={{ fontSize: 18 }} />,
      [
        // getItem(<Link to="/home-content">Thêm thông tin </Link>, "14"),
        getItem(<Link to="/home-content/edit">Cập nhật thông tin </Link>, "15"),
      ]
    ),

    getItem(
      "Quản lý hình ảnh",
      "16",
      <PictureOutlined style={{ fontSize: 18 }} />,
      [
        getItem(<Link to="/banner">Quản lý hình ảnh</Link>, "17"),
        getItem(<Link to="/banner/add">Thêm hình ảnh</Link>, "18"),
        getItem(<Link to="/banner-pos">Quản lý vị trí</Link>, "19"),
        getItem(<Link to="/banner-pos/add">Thêm vị trí</Link>, "20"),
      ]
    ),
  ];

  const fetchPermission = async () => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(config.host + "/admin/admin-permission", {
        headers: headers,
      });
      setCategoryPermissionData(res.data.categoryPermission);
    } catch (error) {
      console.error("fetch data fail.");
    }
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  const sideBarFilter = [
    getItem(
      <Link to="/">Bảng điều khiển</Link>,
      "1",
      <DashboardOutlined style={{ fontSize: "18px" }} />
    ),
    ...items.filter((item, idx) => categoryPermissionData.includes(idx)),
  ];

  return (
    <Layout hasSider>
      <Sider
        className="aside"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          maxWidth: 600,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={sideBarFilter}
          style={{ fontSize: "16px" }}
        />
      </Sider>

      {/* <AppLeftHand/> */}

      <Layout style={{ marginLeft: 280 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <AppHeader />
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 16,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <AppContent />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Quỹ học bổng Nguyên Kim ©{new Date().getFullYear()} created by
          nguyenkim-it-group.
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DefaultLayout;
