import { Flex, Space, Table } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";

function StudentInfo() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData(1);
  }, [search]);

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
        config.host + `/admin/student?page=${page}&data=${search}`,
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

  const onSearch = (value) => setSearch(value);

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
      title: "Lý do vay",
      dataIndex: "reasonLoan",
      key: "reasonLoan",
      render: (text, record) => {
        return <span>{record.reason}</span>;
      },
    },
    {
      title: "Số tiền vay",
      dataIndex: "loanAmount",
      key: "loanAmount",
      render: (text, record) => {
        return <span>{record.loan}</span>;
      },
    },
    {
      title: "Thời gian hoàn trả",
      dataIndex: "refundTime",
      key: "refundTime",
      render: (text, record) => {
        return <span>{dayjs(record.deadline).format("DD/MM/YYYY")}</span>;
      },
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
        return <Link to={`/student/detail/${record.id}`}>Chi tiết</Link>;
      },
    },
  ];
  return (
    <div className="row">
      <div className="col-12">
        <h2>Quản trị học viên</h2>
      </div>
      <div className="col-12 mt-3">
        <Search
          style={{ marginBottom: "20px" }}
          placeholder="Tìm kiếm thông tin"
          onSearch={onSearch}
          enterButton
        />
        <Table
          pagination={{
            pageSize: 5,
            total: total,
            onChange: (page) => {
              fetchData(page);
            },
          }}
          loading={loading}
          columns={columns}
          dataSource={studentData}
        />
      </div>
    </div>
  );
}

export default StudentInfo;
