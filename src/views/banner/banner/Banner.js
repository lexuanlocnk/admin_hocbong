import { Button, Popconfirm, Spin, Table, message, notification } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../config";
import axios from "axios";
import "../../../css/AddNews.css";
import { CButton, CCol, CContainer, CRow } from "@coreui/react";

function Banner() {
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState("");
  const [isDeleted, setIsDeleted] = useState();

  const [api, contextHolder] = notification.useNotification();

  const [isCollapse, setIsCollapse] = useState(false);

  // search input
  const [dataSearch, setDataSearch] = useState("");

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Xóa không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const handleAddNewClick = () => {
    navigate("/banner/add");
  };

  // search Data
  const handleSearch = (keyword) => {
    fetchBannerData(1, keyword);
  };

  useEffect(() => {
    fetchBannerData();
  }, [isDeleted]);

  const fetchBannerData = async (page = 1, dataSearch) => {
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
        config.host + `/admin/banner?data=${dataSearch}&page=${page}`,
        {
          headers: headers,
        }
      );
      setBannerData(res.data.list.data);
      setTotal(res.data.list.total);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vị trí banner", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.delete(config.host + `/admin/banner/${id}`, {
        headers: headers,
      });
      if (res.data.status === true) {
        setIsDeleted(true);
        message.success("Xóa hình ảnh thành công!");
      } else if ((res.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.info("Không thể xóa hình ảnh. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa hình ảnh.", error);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: 60,
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "bannerTitle",
      key: "bannerTitle",
      render: (text, record) => {
        return <span>{record.title}</span>;
      },
    },

    {
      title: "Hình ảnh",
      dataIndex: "newsImage",
      key: "newsImage",
      render: (text, record) => {
        return (
          <div className="image is-5by4">
            <img
              className="w-100 h-100"
              src={config.img + record.picture}
              alt={record.title}
            />
          </div>
        );
      },
    },

    {
      title: "Liên kết",
      dataIndex: "link",
      key: "link",

      render: (text, record) => {
        return (
          <Link target="_blank" title={record.url} to={record.url}>
            {record.url}
          </Link>
        );
      },
      ellipsis: true,
    },

    {
      title: "Tên vị trí",
      dataIndex: "positionName",
      key: "positionName",
      render: (text, record) => {
        return <span>{record.banner_pos.title}</span>;
      },
    },

    {
      title: "Trạng thái ",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return <span>{record.status === 0 ? "Không " : "Hiện thị"}</span>;
      },
    },

    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      width: 180,
      render: (text, record) => {
        return (
          <div className="d-flex align-items-center">
            <Link to={`/banner/edit/${record.id}`}>
              <CButton size="sm">Chi tiết</CButton>
            </Link>
            <div className="ms-2">
              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button type="primary" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <CContainer>
        <CRow className="mb-3">
          <CCol md={6}>
            <h3>QUẢN LÝ HÌNH ẢNH</h3>
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
              <Link to={`/banner`}>
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
                        <em>Tìm kiếm theo Tiêu đề</em>
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
          <div className="col-12">
            <Table
              bordered
              pagination={{
                pageSize: 5,
                total: total,
                onChange: (page) => {
                  fetchBannerData(page);
                },
              }}
              loading={loading}
              dataSource={bannerData}
              columns={columns}
            />
          </div>
        </CRow>
      </CContainer>
    </>
  );
}

export default Banner;
