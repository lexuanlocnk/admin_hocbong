import { Flex, Space, Table } from "antd";
import Column from "antd/es/table/Column";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import Search from "antd/es/input/Search";

function SponsorsList() {
  const [sponsorData, setSponsorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData(1);
  }, [search]);

  const fetchData = async (page) => {
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
        config.host + `/admin/member?page=${page}&data=${search}`,
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
      title: "Tên đăng nhập",
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
      render: (text, record) => {
        return <Link to={`/sponsor/detail/${record.id}`}>Chi tiết</Link>;
      },
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <h2>Quản trị mạnh thường quân</h2>
      </div>
      <div className="col-12">
        <Search
          style={{ marginBottom: "20px" }}
          placeholder="Tìm kiếm thông tin"
          onSearch={onSearch}
          enterButton
        />
        <Table
          loading={loading}
          columns={columns}
          dataSource={sponsorData}
          pagination={{
            pageSize: 5,
            total: total,
            onChange: (page) => {
              fetchData(page);
            },
          }}
        />
      </div>
    </div>
  );
}

export default SponsorsList;
