import { Button, Form, Input, Radio, Spin } from "antd";
import { message, Upload, notification } from "antd";
import { Select, Row, Col } from "antd";

import "../../css/AddNews.css";

import { useEffect, useState } from "react";
import config from "../../config";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddNews() {
  const [dataNews, setDataNews] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;
  const { search } = useLocation();
  const idNews = new URLSearchParams(search).get("idNews");
  const navigate = useNavigate();

  const [checkViewPermission, setCheckViewPermission] = useState(false);
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
  const submitFormAddNews = async (value) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.post(config.host + "/admin/news", value, {
        headers: headers,
      });
      if (res.data.status == true) {
        message.success("Thêm mới thành công!");
        navigate(`/news/add?idNews=${res.data.newsId}`);
      } else if ((res.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.warning("Thêm mới không thành công!");
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  const submitFormUpdateNews = async (value) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.put(
        config.host + `/admin/news/${idNews}`,
        value,
        {
          headers: headers,
        }
      );
      if (res.data.status == true) {
        message.success("Cập nhật thành công thành công!");
        fetchDataEdit(idNews);
      } else {
        openNotificationWithIcon("warning");
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  const fetchDataEdit = async (id) => {
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
        config.host + `/admin/news/${id}/edit`,

        {
          headers: headers,
        }
      );
      if (res.data.status == true) {
        setLoading(false);
        setDataNews(res.data.data);
        form.setFieldsValue({
          title: res.data.data.title,
          short: res.data.data.short,
          url: res.data.data.friendly_title,
          metaKeyword: res.data.data.metakey,
          metaDescription: res.data.data.metadesc,
          titleDesc: res.data.data.title_des,
          cateNews: res.data.data.cate_new == 1 ? 1 : 2,
          status: res.data.data.status == 1 ? 1 : 2,
        });
      } else {
        setCheckViewPermission(true);
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  console.log(
    "dataNews.description ? dataNews.description :",
    dataNews.description ? dataNews.description : "oke"
  );
  useEffect(() => {
    if (idNews && idNews != null) {
      fetchDataEdit(idNews);
    }
  }, [idNews]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
          <h2>Thêm mới tin tức</h2>
          <Row style={{ justifyContent: "space-between" }}>
            <Col span={24}>
              <Form
                onFinish={idNews ? submitFormUpdateNews : submitFormAddNews}
                form={form}
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off"
              >
                <Form.Item label="Tiêu đề" name="title">
                  <Input />
                </Form.Item>

                <Form.Item label="Nội dung" name="contentNews">
                  <CKEditor
                    editor={ClassicEditor}
                    data={dataNews.description ? dataNews.description : ""}
                    onChange={(event, editor) => {
                      form.setFieldsValue({ contentNews: editor.getData() });
                    }}
                    onReady={(editor) => {
                      form.setFieldsValue({ contentNews: editor.getData() });
                    }}
                  />
                </Form.Item>

                <Form.Item label="Mô tả ngắn" name="short">
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Chuỗi đường dẫn" name="url">
                  <Input />
                </Form.Item>

                <Form.Item label="Tiêu đề chi tiết" name="titleDesc">
                  <Input />
                </Form.Item>

                <Form.Item label="Meta keywords" name="metaKeyword">
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Meta description" name="metaDescription">
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item name="cateNews" label="Danh mục">
                  <Radio.Group>
                    <Radio value={1}>Tin nội bộ</Radio>
                    <Radio value={2}>Hoạt động quỹ</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="picture"
                  label="Upload"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    className="upload-news"
                    previewFile={getBase64}
                    defaultFileList={[
                      {
                        url: dataNews.picture
                          ? config.img + dataNews.picture
                          : false,
                      },
                    ]}
                    beforeUpload={false}
                    name="logo"
                    accept="png,jpeg,jpg"
                  >
                    <span>Tải hình ảnh</span>
                  </Upload>
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
                    <Option value={1}>Có</Option>
                    <Option value={2}>Không</Option>
                  </Select>
                </Form.Item>
                <Form.Item className="text-center">
                  <Button type="primary" htmlType="submit">
                    {idNews ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default AddNews;
