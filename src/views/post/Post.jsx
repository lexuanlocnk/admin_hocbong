import { CButton, CCol, CContainer, CFormSelect, CRow } from "@coreui/react";
import { DatePicker, Popconfirm, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";

function Post() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [isCollapse, setIsCollapse] = useState(false);

  // search input
  const [dataSearch, setDataSearch] = useState("");

  //pagination state
  const [pageNumber, setPageNumber] = useState(1);

  const handleAddNewClick = () => {
    navigate("/post/add");
  };

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  const validateDates = (start, end) => {
    if (!start || !end) {
      return "Vui lòng chọn cả hai ngày.";
    }
    if (end.isBefore(start)) {
      return "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.";
    }
    return "";
  };

  const onChangeStartDate = (date, dateString) => {
    const start = date ? moment(dateString, "DD/MM/YYYY") : null;
    setStartDate(start);
    const errorMsg = validateDates(start, endDate);
    setError(errorMsg);
  };

  const onChangeEndDate = (date, dateString) => {
    const end = date ? moment(dateString, "DD/MM/YYYY") : null;
    setEndDate(end);
    const errorMsg = validateDates(startDate, end);
    setError(errorMsg);
  };

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    if (newPage < 2) {
      setPageNumber(newPage);
      window.scrollTo(0, 0);
      return;
    }
    window.scrollTo(0, 0);
    setPageNumber(newPage);
  };

  // search Data
  const handleSearch = (keyword) => {
    // fetchDataCoupon(keyword);
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
      title: "Thông tin ",
      dataIndex: "newsInfo",
      key: "newsInfo",
      render: (text, record) => {
        return <span>{record.views} truy cập</span>;
      },
    },

    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      render: (text, record) => {
        return (
          <>
            <Link to={`/news/add?idNews=${record.id}`}>Chi tiết</Link>
            <div className="mt-3">
              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                // onConfirm={() => handleDelete(record.id)}
              >
                <a>Xóa</a>
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];

  return (
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
            <Link to={`/coupon`}>
              <CButton color="primary" type="submit" size="sm" className="ms-2">
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
                  <td className="total-count">6</td>
                </tr>

                <tr>
                  <td>Tạo từ ngày</td>
                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        onChange={onChangeStartDate}
                      />
                      {"đến ngày"}
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        onChange={onChangeEndDate}
                      />
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </td>
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

      <CRow>
        <CCol>
          <Table
            pagination={{
              pageSize: 5,
              total: total,
              onChange: (page) => {
                // fetchData(page);
              },
            }}
            loading={loading}
            dataSource={newsData}
            columns={columns}
          />
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default Post;
