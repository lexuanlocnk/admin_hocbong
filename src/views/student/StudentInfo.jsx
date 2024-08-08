import { Flex, Space, Table } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import { CButton, CCol, CContainer, CFormSelect, CRow } from "@coreui/react";

function StudentInfo() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState("");

  // search input
  const [dataSearch, setDataSearch] = useState("");
  const [valueInputExcel, setValueInputExcel] = useState({
    value: "",
    error: "",
  });

  const [isCollapse, setIsCollapse] = useState(false);

  const handleChangeInputExcel = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");

    let error = "";
    if (numericValue && numericValue[0] !== "0") {
      error = "Số điện thoại phải bắt đầu bằng số 0";
    } else if (numericValue.length > 10) {
      error = "Số điện thoại không được quá 10 chữ số";
    }

    if (numericValue.length <= 10) {
      setValueInputExcel({ value: numericValue, error });
    } else {
      setValueInputExcel((prevState) => ({ ...prevState, error }));
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(1);
  }, []);

  const fetchData = async (page = 1, dataSearch = "") => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(
        config.host + `/admin/student?page=${page}&data=${dataSearch}`,
        {
          headers: headers,
        }
      );
      setStudentData(res.data.dataStudent.reverse());
      setLoading(false);
      setTotal(res.data.count);
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

  const handleExportExcel = async () => {
    try {
      const response = await axios({
        url: `${config.host}/student-export`,
        data: valueInputExcel,
        method: "post",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "danh-sach-sinh-vien.xlsx"); // Đặt tên file tải về
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Dọn dẹp URL Blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data", error);
    }
  };

  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "STT",
    //   key: "STT",
    //   render: (text, record, index) => {
    //     return <span>{index + 1}</span>;
    //   },
    // },
    {
      title: "Mã hợp đồng",
      dataIndex: "contractCode",
      key: "contractCode",
      render: (text, record) => {
        return <span>{record.signCode}</span>;
      },
    },
    {
      title: "Tên sinh viên",
      dataIndex: "studentName",
      key: "studentName",
      render: (text, record) => {
        return <span>{record.nameMember}</span>;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "numberPhone",
      key: "numberPhone",
      render: (text, record) => {
        return <span>{record.phoneMember}</span>;
      },
    },
    {
      title: "Số lần nhận",
      dataIndex: "reasonLoan",
      key: "reasonLoan",
      // render: (text, record) => {
      //   return <span>{record.reason}</span>;
      // },
    },
    // {
    //   title: "Số tiền vay",
    //   dataIndex: "loanAmount",
    //   key: "loanAmount",
    //   render: (text, record) => {
    //     return <span>{record.loan}</span>;
    //   },
    // },
    {
      title: "Lần nhận gần nhất",
      dataIndex: "refundTime",
      key: "refundTime",
      // render: (text, record) => {
      //   return <span>{dayjs(record.deadline).format("DD/MM/YYYY")}</span>;
      // },
    },

    {
      title: "Trạng thái",
      dataIndex: "refundTime",
      key: "refundTime",
      render: (text, record) => {
        return <span>{record.status === 0 ? "Chưa duyệt" : "Đã duyệt"}</span>;
      },
    },

    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      render: (text, record) => {
        return (
          <Link to={`/student/detail/${record.id}`}>
            <CButton color="primary" size="sm">
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
          <h3>QUẢN LÝ HỌC BỔNG</h3>
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
                  <td>Bộ lọc xuất Excel</td>
                  <td className="">
                    <div>
                      <strong>
                        <em>Nhập SĐT của mạnh thường quân để xuất excel</em>
                      </strong>
                      <input
                        type="text"
                        className="search-input"
                        value={valueInputExcel.value}
                        onChange={handleChangeInputExcel}
                      />{" "}
                      <button
                        onClick={handleExportExcel}
                        className="submit-btn"
                      >
                        Xuất excel
                      </button>
                      {valueInputExcel && valueInputExcel.error && (
                        <div>
                          <span className="error">{valueInputExcel.error}</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Tìm kiếm</td>
                  <td>
                    <div className="mt-2">
                      <strong>
                        <em>
                          Tìm kiếm theo Mã hợp đồng, Tên sinh viên, Số điện
                          thoại
                        </em>
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
                        Tìm kiếm
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
              pageSize: 10,
              total: total,
              onChange: (page) => {
                fetchData(page);
              },
            }}
            loading={loading}
            columns={columns}
            dataSource={studentData}
          />
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default StudentInfo;
