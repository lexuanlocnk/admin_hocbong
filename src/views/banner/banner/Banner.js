import { Button, Popconfirm, Spin, Table, message, notification } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../config";
import axios from "axios";
import "../../../css/AddNews.css";

function Banner() {
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState([]);
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
    fetchBannerData();
  }, [search, isDeleted]);

  const fetchBannerData = async (page) => {
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
        config.host + `/admin/banner?data=${search}&page=${page}`,
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
        return <span >{index + 1}</span>;
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
      width: 60,

      render: (text, record) => {
        return <Link target="_blank" title={record.url} to={record.url}>{record.url}</Link>;
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
      render: (text, record) => {
        return (
          <div>
            <Link to={`/banner/edit/${record.id}`}>Chi tiết</Link>
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
          <h2 style={{
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}>Quản lý hình ảnh</h2>
          <Button onClick={() => navigate("/banner/add")} type="primary">
            Thêm mới hình ảnh
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
                  fetchBannerData(page);
                },
              }}
              loading={loading}
              dataSource={bannerData}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
