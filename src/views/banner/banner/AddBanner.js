import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import config from "../../../config";

import "../../../css/AddNews.css";

function AddBanner() {
  const [positionData, setPositionData] = useState();
  const [loading, setLoading] = useState({
    button: false,
    bannerPos: false,
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    fetchBannerPositionData();
  }, []);

  const fetchBannerPositionData = async (page) => {
    setLoading({ ...loading, bannerPos: true });
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(config.host + `/admin/banner-pos`, {
        headers: headers,
      });
      setPositionData(res.data.list.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vị trí banner", error);
    } finally {
      setLoading({ ...loading, bannerPos: false });
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading({ ...loading, button: true });
      const res = await axios.post(
        config.host + `/admin/banner`,
        {
          title: values.title,
          picture: values.picture,
          pos_id: values.selectPosition,
          status: values.status,
          url: values.link
        },
        { headers: config.headers }
      );

      if (res.data.status === true) {
        message.success("Thêm banner thành công.");
      } else if (res.data.mess == "no permission") {
        openNotificationWithIcon("warning");
      } else {
        message.error("Thêm banner thất bại. Vui lòng kiểm lại thông tin.");
      }
    } catch (error) {
      console.error("Lỗi không thể thêm mới banner", error);
    } finally {
      setLoading({ ...loading, button: false });
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Thêm mới banner thất bại. Vui lòng kiểm tra lại thông tin!");
  };

  console.log(">>>> positionData", positionData);

  return (
    <>
      {contextHolder}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 style={{
              fontWeight: 700
            }}>THÊM MỚI HÌNH ẢNH</h2>
          </div>

          <div className="col-12">
            <Form
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Tiêu đề không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="picture"
                label="Upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Hình ảnh banner là bắt buộc!",
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  className="upload-news"
                  previewFile={getBase64}
                  // defaultFileList={[
                  //   {
                  //     url: dataNews.picture
                  //       ? config.img + dataNews.picture
                  //       : false,
                  //   },
                  // ]}
                  beforeUpload={false}
                  name="logo"
                  accept="png,jpeg,jpg"
                >
                  <span>Tải hình ảnh</span>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Liên kết"
                name="link"
                rules={[
                  {
                    required: true,
                    message: "Liên kết không được để trống!",
                  },
                ]}
                
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="selectPosition"
                label="Vị trí banner"
                rules={[
                  { required: true, message: "Vị trí hiển thị là bắt buộc" },
                ]}
              >
                <Select
                  defaultValue="Chọn vị trí"
                  style={{ width: "100%" }}
                  // onChange={handleChange}
                  options={
                    positionData &&
                    positionData.length > 0 && [
                      ...positionData.map((item) => ({
                        label: item.title,
                        value: item.id,
                      })),
                    ]
                  }
                />
              </Form.Item>

              

              <Form.Item
                name="status"
                label="Cho phép hiển thị"
                rules={[
                  { required: true, message: "Hãy chọn trạng thái hiển thị" },
                ]}
              >
                <Select
                  loading={loading.bannerPos}
                  name="selectStatus"
                  placeholder="Hãy chọn trạng thái hiển thị"
                >
                  <Select.Option value={1}>Có</Select.Option>
                  <Select.Option value={0}>Không</Select.Option>
                </Select>
              </Form.Item>

              

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  loading={loading.button}
                  type="primary"
                  htmlType="submit"
                >
                  Thêm mới
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBanner;
