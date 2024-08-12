import { Table, Tag, Popover } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import config from "../../config";
import ModalDetailJob from "./modalDetailJob";

function TableTaskStudent({ id }) {
  const [open, setOpen] = useState({
    openModalDetail: false,
    idTask: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModalPost, setLoadingModalPost] = useState(false);

  const [dataJob, setDataJob] = useState();
  const [dataListJob, setDataListJob] = useState();

  const handleOpenModal = useCallback((modalName, status, value) => {
    console.log("value", value);

    if (modalName === "openModalDetail" && status === true) {
      fetchListPostJob(value?.idTask);
    }
    setOpen((prev) => ({
      ...prev,
      [modalName]: status,
      idTask: value?.idTask || null,
    }));
  }, []);

  const fetchDataJob = async (page) => {
    setIsLoading(true);

    let headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("adminvtnk");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await axios.get(
        config.host + `/admin/show-task-for-student/${id}?page=${page ?? 1}`,
        {
          headers: headers,
        }
      );

      if (res.data.status === true) {
        setIsLoading(false);
        setDataJob(res.data);
      }
    } catch (error) {
      console.error("fail to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchListPostJob = async (idTask) => {
    setLoadingModalPost(true);
    let headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("adminvtnk");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await axios.get(
        config.host + `/admin/show-detail-task-for-student/${id}/${idTask}`,
        {
          headers: headers,
        }
      );

      if (res.data.status === true) {
        setDataListJob(res.data);
        setLoadingModalPost(false);
      }
    } catch (error) {
      console.error("fail to fetch data.");
    } finally {
      setLoadingModalPost(false);
    }
  };

  useEffect(() => {
    fetchDataJob();
  }, []);

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "nameJob",
      key: "nameJob",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Trạng thái công việc",
      dataIndex: "statusJob",
      key: "statusJob",
      render: (text) => {
        let color = text === "Đã hoàn thành" ? "green" : "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },

    {
      title: "Số bài viết",
      dataIndex: "numberOfPost",
      key: "numberOfPost",
    },

    {
      title: "Ngày hết hạn",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
    },
    {
      title: "#",
      key: "action",
      width: 120,
      render: (text, record) => {
        return (
          <div className="box_action">
            <span
              onClick={() => handleOpenModal("openModalDetail", true, record)}
              className="btn_detail_post"
            >
              Xem chi tiết
            </span>
          </div>
        );
      },
    },
  ];

  const data =
    dataJob && dataJob?.data && dataJob?.data?.length > 0
      ? dataJob?.data?.map((item, index) => ({
          idTask: item.taskId,
          key: index, // Sử dụng key từ item hoặc chỉ số nếu không có key
          // stt: index + 1, // Sử dụng stt từ item hoặc chỉ số + 1 nếu không có stt
          nameJob: item.title,
          deadline: dayjs.unix(item.endDate).format("DD/MM/YYYY"),
          statusJob: item.status === 0 ? "Chưa hoàn thành" : "Đã Hoàn thành",
          descriptionJob: (
            <Popover
              content={
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              }
            >
              <div
                className="box_description_task"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </Popover>
          ),
          numberOfPost: (item?.listLink?.length ?? 0) + " / 3",
        }))
      : [];

  return (
    <div className="container mb-3">
      <h3 className="mt-6 mb-4 text-lg font-semibold">Danh sách công việc</h3>
      <Table
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          onChange: (page, pageSize) => {
            fetchDataJob(page);
          },
          total: dataJob?.count,
        }}
        loading={isLoading}
        dataSource={data}
        columns={columns}
      />

      <ModalDetailJob
        fetchDataJob={fetchDataJob}
        fetchListPostJob={fetchListPostJob}
        loading={loadingModalPost}
        dataListJob={dataListJob}
        open={open}
        handleOpenModal={handleOpenModal}
      />
    </div>
  );
}

export default TableTaskStudent;
