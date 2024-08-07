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
import { Link } from "react-router-dom";
import { CButton, CCol, CFormInput, CImage } from "@coreui/react";

function AddBanner() {
  const [positionData, setPositionData] = useState();
  const [loading, setLoading] = useState({
    button: false,
    bannerPos: false,
  });

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState("");
  const [file, setFile] = useState([]);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  //set img detail
  function onFileChange(e) {
    const files = e.target.files;
    const selectedFiles = [];
    const fileUrls = [];

    Array.from(files).forEach((file) => {
      // Create a URL for the file
      fileUrls.push(URL.createObjectURL(file));

      // Read the file as base64
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = (event) => {
        selectedFiles.push(event.target.result);
        // Set base64 data after all files have been read
        if (selectedFiles.length === files.length) {
          setSelectedFile(selectedFiles);
        }
      };
    });

    // Set file URLs for immediate preview
    setFile(fileUrls);
  }

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
          pos_id: values.selectPosition,
          status: values.status,
          url: values.link,
          picture: selectedFile,
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

  return (
    <>
      {contextHolder}
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h3>THÊM MỚI HÌNH ẢNH</h3>
          </div>
          <div className="col-6">
            <div className="d-flex justify-content-end">
              <Link to={`/banner`}>
                <CButton color="primary" type="submit" size="sm">
                  Danh sách
                </CButton>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
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

              <div className="row">
                <div className="col-12">
                  <CFormInput
                    name="picture"
                    type="file"
                    id="formFile"
                    label="Hình ảnh đại diện"
                    onChange={(e) => onFileChange(e)}
                    size="sm"
                  />
                  <br />
                </div>

                <div className="col-12">
                  {file.length == 0 ? (
                    <div>
                      <CImage
                        className="border"
                        src={
                          `http://192.168.245.180:8000/upload/` + selectedFile
                        }
                        width={200}
                      />
                    </div>
                  ) : (
                    file.map((item, index) => (
                      <CImage key={index} src={item} width={200} />
                    ))
                  )}
                </div>
              </div>
              <br />

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
