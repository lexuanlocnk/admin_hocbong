import { Button, Popconfirm, Table, message, notification } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useAsyncError, useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import "../../css/AddNews.css";
import { CButton, CCol, CContainer, CFormSelect, CRow } from "@coreui/react";

function News() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState("");
  const [typeNews, setTypeNews] = useState("");

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

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [typeNews]);

  const fetchData = async (page) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(
        config.host +
          `/admin/news?data=${search}&page=${page}&cateNews=${typeNews ?? ""}`,
        {
          headers: headers,
        }
      );
      setNewsData(res.data.data.data);
      setTotal(res.data.data.total);
      setLoading(false);
    } catch (error) {
      console.error("fetch data error", error);
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
      const res = await axios.delete(config.host + `/admin/news/${id}`, {
        headers: headers,
      });
      if (res.data.status === true) {
        message.success("Xóa tin tức thành công!");
        fetchData();
      } else if ((res.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.info("Không thể xóa tin tức. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("fail to fetch data.");
    }
  };

  const handleAddNewClick = () => {
    navigate("/news/add");
  };
  const onChangeNews = (e) => {
    setTypeNews(e.target.value);
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
    {
      title: "Tiêu đề",
      dataIndex: "newsTitle",
      key: "newsTitle",
      width: "50%",
      render: (text, record) => {
        return <span>{record.title}</span>;
      },

      // ellipsis: true,
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
      title: "Danh mục",
      dataIndex: "newsCategory",
      key: "newsCategory",
      render: (text, record) => {
        return (
          <span>{record.cate_new === 1 ? "Tin nội bộ" : "Hoạt động quỹ"}</span>
        );
      },
    },

    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      width: 150,
      render: (text, record) => {
        return (
          <div className="d-flex align-items-center">
            <Link to={`/news/edit?news_id=${record?.id}`}>
              <CButton size="sm">Chi tiết</CButton>
            </Link>
            <div className="ms-2">
              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleDelete(record.id)}
              >
                <CButton color="danger" size="sm">
                  Xóa
                </CButton>
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
          <CCol>
            <h3>QUẢN LÝ TIN TỨC</h3>
          </CCol>
          <CCol md={{ span: 4, offset: 4 }}>
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
              <Link to={`/news`}>
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
                    <td>Lọc theo danh mục</td>
                    <td>
                      <CFormSelect
                        onChange={onChangeNews}
                        className="component-size w-25"
                        aria-label="Chọn yêu cầu lọc"
                        options={[
                          { label: "Tất cả ", value: "" },

                          { label: "Tin nội bộ", value: "1" },
                          { label: "Tin hoạt động", value: "2" },
                        ]}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Tìm kiếm</td>
                    <td>
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
              pagination={{
                pageSize: 5,
                total: total,
                onChange: (page) => {
                  fetchData(page);
                },
              }}
              loading={loading}
              dataSource={newsData}
              columns={columns}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
}

export default News;
