import { Row, Input, Button, Table, Col, Spin } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../css/Admin.css";
import axios from "axios";
import config from "../../../config";
import dayjs from "dayjs";

function Admin() {
  const [adminData, setAdminData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState("");
  const [search, setSearch] = useState("");

  const { Search } = Input;

  const onSearch = (value, _e, info) => setSearch(value);

  useEffect(() => {
    fetchAdminData(1);
  }, [search]);

  const fetchAdminData = async (page, value) => {
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
        config.host + `/admin/infomation?page=${page}&data=${search}`,
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
    <div className="container">
      <div className="row">
        <h2>Quản trị tài khoản Admin</h2>
        <div className="col-md">
          <Search
            style={{ marginBottom: "20px" }}
            placeholder="Tìm kiếm thông tin"
            onSearch={onSearch}
            enterButton
          />
          <Table
            loading={isLoading}
            dataSource={data}
            pagination={{
              pageSize: 5,
              total: total,
              onChange: (page) => {
                fetchAdminData(page);
              },
            }}
          >
            <Column title="Tên đăng nhập" dataIndex="username" key="username" />
            {/* <Column title="Avatar" dataIndex="avatar" key="avatar" render={(dataIndexValue, record) => <img style={{ maxWidth: '120px', maxHeight: '120px' }} src={dataIndexValue} alt={record.name} />} /> */}
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
                <Link to={`/admin/edit/${record.key}`}>Xem chi tiết</Link>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
