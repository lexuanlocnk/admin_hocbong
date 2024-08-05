import { Button, Popconfirm, Table, message, notification } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useAsyncError, useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import "../../css/AddNews.css";

function News() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState();
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
    setLoading(true);
    fetchData();
  }, [search, isDeleted]);

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
        config.host + `/admin/news?data=${search}&page=${page}`,
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
                onConfirm={() => handleDelete(record.id)}
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
    <>
      {contextHolder}
      <div>
        <div className="mb-3">
          <h2>Quản trị tin tức</h2>
          <Button onClick={() => navigate("/news/add")} type="primary">
            Thêm mới bài viết
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
                  fetchData(page);
                },
              }}
              loading={loading}
              dataSource={newsData}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default News;
