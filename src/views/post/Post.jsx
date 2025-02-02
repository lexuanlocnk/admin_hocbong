import { CButton, CCol, CContainer, CFormSelect, CRow } from "@coreui/react";
import { DatePicker, message, notification, Popconfirm, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";

function Post() {
  const navigate = useNavigate();

  const [dataTask, setDataTask] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isCollapse, setIsCollapse] = useState(false);

  // search input
  const [dataSearch, setDataSearch] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Xóa không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const handleAddNewClick = () => {
    navigate("/post/add");
  };

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

  // search Data
  const handleSearch = (keyword) => {
    fetchPostData(1, keyword);
  };

  const fetchPostData = async (page = 1, dataSearch = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.host}/admin/task?page=${page}&data=${dataSearch}`,
        {
          headers: config.headers,
        }
      );

      if (response.data.status === true) {
        setDataTask(response.data.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetch task data is error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(config.host + `/admin/task/${id}`, {
        headers: config.headers,
      });
      if (res.data.status === true) {
        message.success("Xóa nhiệm vụ thành công!");
        fetchPostData();
      } else if (res.data.mess == "no permission") {
        openNotificationWithIcon("warning");
      } else {
        message.info("Không thể xóa tin tức. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Deleted task is error");
      message.error("Đã xảy ra lỗi khi xóa. Vui lòng thử lại!");
    }
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
      dataIndex: "taskTitle",
      key: "taskTitle",
      render: (text, record) => {
        return <span>{record.title}</span>;
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, record) => {
        return (
          <span>{moment.unix(record.startDate).format("DD-MM-YYYY")}</span>
        );
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record) => {
        return <span>{moment.unix(record.endDate).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "datePost",
      key: "datePost",
      render: (text, record) => {
        return <span>{moment.unix(record.datePost).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return <span>{record.display === 1 ? "Hiển thị" : "Ẩn bài"} </span>;
      },
    },

    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      width: 150,
      render: (text, record) => {
        return (
          <div className="d-flex gap-2 align-items-center">
            <Link to={`/post/edit?task_id=${record.id}`}>
              <CButton color="primary" size="sm">
                Chi tiết
              </CButton>
            </Link>
            <div>
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
            <h3>QUẢN LÝ NHIỆM VỤ</h3>
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
              <Link to={`/post`}>
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
                    <td className="total-count">{dataTask?.total}</td>
                  </tr>

                  <tr>
                    <td>Tìm kiếm</td>
                    <td>
                      <CFormSelect
                        className="component-size w-25"
                        aria-label="Chọn yêu cầu lọc"
                        options={[{ label: "Tiêu đề nhiệm vụ", value: "1" }]}
                      />
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

        <CRow className="mt-2">
          <CCol>
            <Table
              bordered
              rowHoverable={true}
              pagination={{
                pageSize: dataTask?.per_page,
                total: dataTask?.total,
                onChange: (page) => {
                  fetchPostData(page);
                },
              }}
              loading={loading}
              dataSource={Array.isArray(dataTask?.data) ? dataTask.data : []}
              columns={columns}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
}

export default Post;
