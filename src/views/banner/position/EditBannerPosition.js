import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Spin, message, notification } from "antd";
import axios from "axios";
import config from "../../../config";
import { useParams, Link } from "react-router-dom";

function EditBannerPosition() {
  const [form] = Form.useForm();
  const { posId } = useParams();
  const [loading, setLoading] = useState({
    page: false,
    button: false,
  });

  const [checkViewPermission, setCheckViewPermission] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  useEffect(() => {
    fetchBannerPositionData();
  }, []);

  const fetchBannerPositionData = async () => {
    setLoading({ ...loading, page: true });
    try {
      const res = await axios.get(
        config.host + `/admin/banner-pos/${posId}/edit`,
        {
          headers: config.headers,
        }
      );

      if (res.data.status === true) {
        form.setFieldsValue({
          title: res.data.data.title,
          name: res.data.data.name,
          description: res.data.data.description,
          status: res.data.data.status == 1 ? 1 : 0,
        });
      } else {
        if (res.data.mess == "no permission") {
          setCheckViewPermission(true);
        }
      }
    } catch (error) {
      console.error("Lỗi không thể lấy thông tin vị trí banner", error);
    } finally {
      setLoading({ ...loading, page: false });
    }
  };

  const onFinish = async (values) => {
    setLoading({ ...loading, button: true });
    try {
      const res = await axios.put(
        config.host + `/admin/banner-pos/${posId}`,
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
        message.success("Cập nhật vị trí cho banner thành công.");
      } else if (res.data.mess == "no permission") {
        openNotificationWithIcon("warning");
      } else {
        message.error(
          "Cập nhật vị trí banner không thành công. Vui lòng kiểm tra lại"
        );
      }
    } catch (error) {
      console.error("Lỗi không thể thêm mới vị trí banner", error);
    } finally {
      setLoading({ ...loading, button: false });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return checkViewPermission ? (
    <>
      <h2>Bạn không có quyền truy cập trang này.</h2>
      <Link style={{ fontSize: 18 }} to={"/"}>
        Trở lại trang chủ
      </Link>{" "}
    </>
  ) : (
    <>
      {loading.page ? (
        <div className="w-100 text-center">
          {" "}
          <Spin />
        </div>
      ) : (
        <>
          {contextHolder}

          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2>Cập nhật vị trí</h2>
              </div>

              <div className="col-12">
                <Form
                  form={form}
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
                      {
                        required: true,
                        message: "Hãy chọn trạng thái hiển thị",
                      },
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
                    <Button
                      loading={loading.button}
                      type="primary"
                      htmlType="submit"
                    >
                      Cập nhật
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditBannerPosition;
