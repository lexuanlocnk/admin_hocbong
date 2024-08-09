import { Flex, Space, Table } from "antd";
import Column from "antd/es/table/Column";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import Search from "antd/es/input/Search";

import { CButton, CCol, CContainer, CFormSelect, CRow } from "@coreui/react";

function SponsorsList() {
  const [sponsorData, setSponsorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState("");

  // search input
  const [dataSearch, setDataSearch] = useState("");

  const [isCollapse, setIsCollapse] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async (page = 1, dataSearch = "") => {
    setLoading(true);

    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(
        config.host + `/admin/member?page=${page}&data=${dataSearch}`,
        {
          headers: headers,
        }
      );
      setSponsorData(res.data.data.data.reverse());
      setTotal(res.data.data.total);

      setLoading(false);
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

  // search Data
  const handleSearch = (keyword) => {
    fetchData(1, keyword);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    // {
    //   title: 'Mã khách hàng',
    //   dataIndex: 'memberCode',
    //   key: 'memberCode',
    //   render: (text, record) => {
    //     return <span>
    //       {record.mem_code}
    //     </span>;
    //   }
    // },
    {
      title: "Tên mạnh thường quân",
      dataIndex: "memberName",
      key: "memberName",
      render: (text, record) => {
        return <span>{record.username}</span>;
      },
    },
    {
      title: "Email cá nhân",
      dataIndex: "email",
      key: "emailCompany",
    },
    {
      title: "Tên công ty",
      dataIndex: "companyName",
      key: "companyName",
      render: (text, record) => {
        return <span>{record.nameCompany}</span>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return <span>{record.status === 0 ? "Chưa duyệt" : "Đã duyệt"}</span>;
      },
    },
    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      width: 120,
      render: (text, record) => {
        return (
          <Link to={`/sponsor/detail/${record.id}`}>
            <CButton size="sm" color="primary">
              Chi tiết
            </CButton>
          </Link>
        );
      },
    },
  ];

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={6}>
          <h3>QUẢN LÝ MẠNH THƯỜNG QUÂN</h3>
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
                    <div className="mt-2">
                      <strong>
                        <em>Tìm kiếm theo Tên Mạnh Thường Quân, Email</em>
                      </strong>
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
        <Table
          bordered
          loading={loading}
          columns={columns}
          dataSource={sponsorData}
          pagination={{
            pageSize: 10,
            total: total,
            onChange: (page) => {
              fetchData(page);
            },
          }}
        />
      </CRow>
    </CContainer>
  );
}

export default SponsorsList;
