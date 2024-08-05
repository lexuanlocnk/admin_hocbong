import { Button, Col, Form, Input, Row, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import config from "../../config";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddHomeContent() {
  const [form] = useForm();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const handleSubmit = async (values) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.post(
        config.host + `/admin/post`,
        {
          contentMain: values.contentMain,
          contentFooter: values.contentFooter,
        },
        {
          headers: headers,
        }
      );
      if (res.data.status === true) {
        message.info("Thêm mới nội dung thành công.");
      } else {
        openNotificationWithIcon("warning");
      }
    } catch (error) {
      console.error("fail to fetch data.");
    }
  };

  return (
    <>
      {contextHolder}

      <h2>Thêm mới nội dung trang chủ</h2>
      <Row style={{ justifyContent: "space-between" }}>
        <Col span={24}>
          <Form
            form={form}
            onFinish={(values) => handleSubmit(values)}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="off"
          >
            <Form.Item label="Nội dung main:" name="contentMain">
              <CKEditor
                editor={ClassicEditor}
                data={"Testing"}
                onChange={(event, editor) => {
                  form.setFieldsValue({ contentMain: editor.getData() });
                }}
              />
            </Form.Item>

            <Form.Item label="Nội dung footer:" name="contentFooter">
              <CKEditor
                editor={ClassicEditor}
                data={"Testing"}
                onChange={(event, editor) => {
                  form.setFieldsValue({ contentFooter: editor.getData() });
                }}
              />
            </Form.Item>

            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit">
                Thêm mới
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default AddHomeContent;
