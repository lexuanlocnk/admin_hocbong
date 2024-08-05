import { Button, Popconfirm, Spin, Table, message, notification } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../config";
import axios from "axios";
import "../../../css/AddNews.css";

function BannerPosition() {
  const navigate = useNavigate();
  const [positionData, setPositionData] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState("");
  const [isDeleted, setIsDeleted] = useState();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Xóa không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const onSearch = (value, _e, info) => setSearch(value);

  useEffect(() => {
    fetchBannerPositionData();
  }, [search, isDeleted]);

  const fetchBannerPositionData = async (page) => {
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
        config.host + `/admin/banner-pos?data=${search}&page=${page}`,
        {
          headers: headers,
        }
      );
      setPositionData(res.data.list.data);
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
      const res = await axios.delete(config.host + `/admin/banner-pos/${id}`, {
        headers: headers,
      });
      if (res.data.status === true) {
        setIsDeleted(true);
        message.success("Xóa tin tức thành công!");
      } else if ((res.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.info("Không thể xóa tin tức. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("fail to fetch data.");
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
      dataIndex: "positionTitle",
      key: "positionTitle",
      render: (text, record) => {
        return <span>{record.title}</span>;
      },
      // ellipsis: true,
    },
    {
      title: "Tên vị trí",
      dataIndex: "positionName",
      key: "positionName",
      render: (text, record) => {
        return <span>{record.name}</span>;
      },
    },

    {
      title: "Mô tả vị trí ",
      dataIndex: "positionDescriptioin",
      key: "positionDescriptioin",
      render: (text, record) => {
        return <span>{record.description}</span>;
      },
    },

    {
      title: "Tác vụ",
      dataIndex: "task",
      key: "task",
      render: (text, record) => {
        return (
          <div>
            <Link to={`/banner-pos/edit/${record.id}`}>Chi tiết</Link>
            <div className="mt-3">
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
      <div>
        <div className="mb-3">
          <h2>Quản lý vị trí</h2>
          <Button onClick={() => navigate("/banner-pos/add")} type="primary">
            Thêm mới vị trí
          </Button>
        </div>

        <div className="row">
          <div className="col-12 mb-3">
            <Search
              placeholder="Tìm kiếm thông tin"
              onSearch={onSearch}
              enterButton
            />
          </div>

          <div className="col-12">
            <Table
              pagination={{
                pageSize: 5,
                total: total,
                onChange: (page) => {
                  fetchBannerPositionData(page);
                },
              }}
              loading={loading}
              dataSource={positionData}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerPosition;
