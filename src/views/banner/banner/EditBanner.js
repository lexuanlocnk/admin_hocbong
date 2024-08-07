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
import axios from "axios";
import config from "../../../config";
import { useParams, Link } from "react-router-dom";
import { CButton, CFormInput, CImage } from "@coreui/react";

function EditBanner() {
  const [bannerData, setBannerData] = useState();
  const [positionData, setPositionData] = useState();

  const [loading, setLoading] = useState({
    button: false,
    page: false,
  });

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState("");
  const [file, setFile] = useState([]);

  const [form] = Form.useForm();

  const { bannerId } = useParams();

  const [checkViewPermission, setCheckViewPermission] = useState(false);
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
    fetchBannerData();
    fetchBannerPositionData();
  }, []);

  const fetchBannerPositionData = async (page) => {
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
    }
  };

  const fetchBannerData = async () => {
    setLoading({ ...loading, page: true });

    try {
      const res = await axios.get(
        config.host + `/admin/banner/${bannerId}/edit`,
        {
          headers: config.headers,
        }
      );

      if (res.data.status === true) {
        setBannerData(res.data.data);
        setSelectedFile(res.data.data.picture);
        form.setFieldsValue({
          title: res.data.data.title,
          selectPosition: res.data.data.pos_id,
          status: res.data.data.status == 1 ? 1 : 0,
          link: res.data.data.url,
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
        config.host + `/admin/banner/${bannerId}`,
        {
          title: values.title,
          picture: selectedFile,
          pos_id: values.selectPosition,
          status: values.status,
          url: values.link,
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
              <div className="col-6">
                <h3>CẬP NHẬT HÌNH ẢNH</h3>
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
                              `http://192.168.245.180:8000/upload/` +
                              selectedFile
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
                    rules={[]}
                  >
                    <Select
                      loading={loading.bannerPos}
                      name="selectStatus"
                      placeholder="Hãy chọn trạng thái hiển thị"
                    >
                      {positionData &&
                        positionData.length > 0 &&
                        positionData.map((item) => (
                          <Select.Option value={item.id}>
                            {item.title}
                          </Select.Option>
                        ))}
                    </Select>
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

export default EditBanner;
