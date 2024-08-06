import { Row, Input, Button, Table, Col, Spin } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../css/Admin.css";
import axios from "axios";
import config from "../../../config";
import dayjs from "dayjs";
import { CButton, CCol, CContainer, CFormSelect, CRow } from "@coreui/react";

function Admin() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState("");
  // search input
  const [dataSearch, setDataSearch] = useState("");

  const [isCollapse, setIsCollapse] = useState(false);
  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

  const handleAddNewClick = () => {
    navigate("/admin/add");
  };

  // search Data
  const handleSearch = (keyword) => {
    fetchAdminData(1, keyword);
  };

  useEffect(() => {
    fetchAdminData(1);
  }, []);

  const fetchAdminData = async (page = 1, dataSearch = "") => {
    setIsLoading(true);
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(
        config.host + `/admin/infomation?page=${page}&data=${dataSearch}`,
        {
          headers: headers,
        }
      );
      const data = res.data.adminList.data.reverse();
      setAdminData(data);
      setTotal(res.data.adminList.total);
      setIsLoading(false);
    } catch (error) {
      console.error("fetch data error", error);
      setIsLoading(true);
    }
  };

  const data =
    adminData &&
    adminData.length > 0 &&
    adminData.map((item) => ({
      key: item.adminid,
      username: item.username,
      phone: item.phone,
      email: item.email,
      createDate: dayjs(item.created_at).format("DD/MM/YYYY"),
    }));

  return (
    <CContainer>
      <div className="row">
        <CRow className="mb-3">
          <CCol md={6}>
            <h3>QUẢN LÝ TÀI KHOẢN ADMIN</h3>
          </CCol>
          <CCol md={6}>
            <div className="d-flex justify-content-end">
              <CButton
                onClick={handleAddNewClick}
                color="primary"
                type="submit"
                size="sm"
                className="button-add"
              >
                Thêm mới
              </CButton>
              <Link to={`/admin`}>
                <CButton
                  color="primary"
                  type="submit"
                  size="sm"
                  className="ms-2"
                >
                  Danh sách
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>

        <CRow>
          <CCol md={12}>
            <table className="filter-table">
              <thead>
                <tr>
                  <th colSpan="2">
                    <div className="d-flex justify-content-between">
                      <span>Bộ lọc tìm kiếm</span>
                      <span
                        className="toggle-pointer"
                        onClick={handleToggleCollapse}
                      >
                        {isCollapse ? "▼" : "▲"}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              {!isCollapse && (
                <tbody>
                  <tr>
                    <td>Tổng cộng</td>
                    <td className="total-count">{total}</td>
                  </tr>

                  <tr>
                    <td>Tìm kiếm</td>
                    <td>
                      <strong>
                        <em>Tìm kiếm theo Tên đăng nhập, Email tài khoản</em>
                      </strong>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="search-input"
                          value={dataSearch}
                          onChange={(e) => setDataSearch(e.target.value)}
                        />
                        <button
                          onClick={() => handleSearch(dataSearch)}
                          className="submit-btn"
                        >
                          Submit
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </CCol>
        </CRow>

        <CRow className="mt-3">
          <CCol>
            <Table
              bordered
              loading={isLoading}
              dataSource={data}
              pagination={{
                pageSize: 10,
                total: total,
                onChange: (page) => {
                  fetchAdminData(page);
                },
              }}
            >
              <Column
                title="Tên đăng nhập"
                dataIndex="username"
                key="username"
              />
              <Column title="Số điện thoại" dataIndex="phone" key="phone" />
              <Column title="Email " dataIndex="email" key="email" />
              <Column
                title="Ngày khởi tạo "
                dataIndex="createDate"
                key="createDate"
              />
              <Column
                title="Tác vụ"
                key="action"
                render={(record) => (
                  <Link to={`/admin/edit/${record.key}`}>
                    <CButton color="primary" size="sm">
                      Chi tiết
                    </CButton>
                  </Link>
                )}
              />
            </Table>
          </CCol>
        </CRow>
      </div>
    </CContainer>
  );
}

export default Admin;
