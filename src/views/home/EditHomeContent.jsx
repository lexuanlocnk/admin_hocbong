import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Spin,
  message,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";

import axios from "axios";
import config from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CCol, CFormLabel } from "@coreui/react";
import CKedtiorCustom from "../../components/customEditor/customEditor";

function EditHomeContent() {
  const [form] = useForm();

  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [mainEditor, setMainEditor] = useState("");
  const [footerEditor, setFooterEditor] = useState("");

  const [checkViewPermission, setCheckViewPermission] = useState(false);
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      setLoading(true);
      const res = await axios.get(config.host + `/admin/post/3/edit`, {
        headers: headers,
      });
      if (res.data.status === true) {
        setMainEditor(res.data.data.contentMain);
        setFooterEditor(res.data.data.contentFooter);
        form.setFieldsValue({
          gmail: res.data.data.address_email,
          link: res.data.data.address_url,
          address: res.data.data.address_fund,
        });
        setLoading(false);
      } else {
        setCheckViewPermission(true);
      }
    } catch (error) {
      console.error("fail to fetch data.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const res = await axios.put(
        config.host + `/admin/post/3`,
        {
          contentMain: mainEditor,
          contentFooter: footerEditor,
          address_email: values.gmail,
          address_url: values.link,
          address_fund: values.address,
        },
        {
          headers: config.headers,
        }
      );
      if (res.data.status === true) {
        message.info("Cập nhật nội dung thành công.");
      } else {
        openNotificationWithIcon("warning");
      }
    } catch (error) {
      console.error("fail to fetch data.");
    }
  };

  return checkViewPermission ? (
    <>
      <h2>Bạn không có quyền truy cập trang này.</h2>
      <Link style={{ fontSize: 18 }} to={"/"}>
        Trở lại trang chủ
      </Link>
    </>
  ) : (
    <>
      {contextHolder}

      {loading ? (
        <div className="w-100 text-center">
          {" "}
          <Spin />
        </div>
      ) : (
        <>
          <h3>CẬP NHẬT NỘI DUNG TRANG CHỦ</h3>
          <Row style={{ justifyContent: "space-between", marginTop: 24 }}>
            <Col span={24}>
              <Form
                form={form}
                onFinish={(values) => handleSubmit(values)}
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off"
              >
                <CCol md={12}>
                  <CFormLabel>Nội dung giới thiệu học bổng</CFormLabel>
                  <CKedtiorCustom
                    data={mainEditor}
                    onChangeData={(data) => setMainEditor(data)}
                  />
                </CCol>
                <br />

                <div>
                  <h5 className="mb-3">Thông tin chân trang:</h5>

                  <Form.Item
                    label="Địa chỉ gmail:"
                    name="gmail"
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ gmail không được để trống!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Liên kết chính thức:"
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
                    label="Địa chỉ quỹ:"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ qũy không được để trống!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <CCol md={12}>
                    <CFormLabel>Nội dung phần chân trang</CFormLabel>
                    <CKedtiorCustom
                      data={footerEditor}
                      onChangeData={(data) => setFooterEditor(data)}
                    />
                  </CCol>
                  <br />
                </div>

                <Form.Item>
                  <div className="d-flex justify-content-center">
                    <Button type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default EditHomeContent;
