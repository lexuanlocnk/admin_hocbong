import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  message,
  notification,
} from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import config from "../../../config";

function AddBannerPosition() {
  const [loading, setLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        config.host + `/admin/banner-pos`,
        {
          name: values.name,
          title: values.title,
          description: values.description,
          status: values.status,
        },
        {
          headers: config.headers,
        }
      );

      if (res.data.status === true) {
        message.success("Thêm vị trí cho banner thành công.");
      } else if (res.data.mess == "no permission") {
        openNotificationWithIcon("warning");
      } else {
        message.error(
          "Thêm mới vị trí banner không thành công. Vui lòng kiểm tra lại"
        );
      }
    } catch (error) {
      console.error("Lỗi không thể thêm mới vị trí banner", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Thêm mới vị trí thất bại. Vui lòng kiểm tra lại thông tin!");
  };
  return (
    <>
      {contextHolder}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Thêm mới vị trí</h2>
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
                label="Tiêu đề vị trí"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Tiêu đề vị trí không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tên vị trí"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tên vị trí không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Phần thông tin mô tả không được để trống!",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                name="status"
                label="Cho phép hiển thị"
                rules={[
                  { required: true, message: "Hãy chọn trạng thái hiển thị" },
                ]}
              >
                <Select
                  name="selectStatus"
                  placeholder="Hãy chọn trạng thái hiển thị"
                >
                  <Select.Option value={1}>Có</Select.Option>
                  <Select.Option value={0}>Không</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button loading={loading} type="primary" htmlType="submit">
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

export default AddBannerPosition;
