import { CBadge, CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarBrand, CSidebarHeader, CSidebarNav, CSidebarToggler } from "@coreui/react";

import {
  AppstoreOutlined,
  BankOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
function AppLeftHand() {
  return (
    <CSidebar >
    <CSidebarNav>
      <CNavItem href="#">Bảng điều khiển</CNavItem>
      <CNavGroup
        toggler={
          <div style={{columnGap: '16px', display:'flex'}}>
            <AppstoreOutlined/>
            Thông tin quản trị
          </div>
        }
      >
        <CNavItem href="/admin"><span className="nav-icon"><span className="nav-icon-bullet"></span></span> Nav dropdown item</CNavItem>
        <CNavItem href="#"><span className="nav-icon"><span className="nav-icon-bullet"></span></span> Nav dropdown item</CNavItem>
      </CNavGroup>
    </CSidebarNav>
  </CSidebar>
  );
}

export default AppLeftHand;