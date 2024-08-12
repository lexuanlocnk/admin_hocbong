import {
  Form,
  Input,
  Spin,
  Button,
  Radio,
  message,
  notification,
  Upload,
  List,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import ContributeMoney from "./ContributeMoney";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useParams } from "react-router-dom";
import NumberInput from "../../components/inputNumberAntd";
import { UploadOutlined } from "@ant-design/icons";
import { CCol, CContainer, CRow } from "@coreui/react";

function SponsorDetail() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [sponsorDetail, setSponsorDetail] = useState([]);
  const { sponsorId } = useParams();
  const [checkUpdateTable, setCheckUpdateTable] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [checkViewPermission, setCheckViewPermission] = useState(false);
  const [dataContracts, setDataContracts] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  // const [file, setFile] = useState(null);
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Cập nhật thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  // check new upload
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleNewUpload = async () => {
    let headers = {
      "Content-Type": "multipart/form-data",
    };
    const token = localStorage.getItem("adminvtnk");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    let currentFile;
    fileList.forEach((file) => {
      currentFile = file;
    });

    setUploading(true);
    await axios({
      method: "post",
      url: `${config.host}/admin/update-pdf/${sponsorId}`,
      data: { filePdf: currentFile },
      headers: headers,
    })
      .then(() => {
        setFileList([]);
        fetchData();
        message.success("Upload file hợp đồng thành công.");
      })
      .catch(() => {
        message.error("Upload file hợp đồng thất bại.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(
        config.host + `/admin/member/${sponsorId}/edit`,
        {
          headers: headers,
        }
      );
      setSponsorDetail(res.data.data);
      setDataContracts(res.data.dataContract);
      setIsLoading(false);
      if (res.data.mess == "no permission") {
        setCheckViewPermission(true);
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    fetchData();
  }, []);

  useEffect(() => {
    if (sponsorDetail) {
      form.setFieldsValue({
        sponsorName: sponsorDetail.username,
        sponsorEmail: sponsorDetail.email,
        sponsorPhone: sponsorDetail.phoneCompany,
        sponsorIdCard: sponsorDetail.mem_code,
        companyName: sponsorDetail.nameCompany,
        companyAddress: sponsorDetail.addressCompany,
        companyEmail: sponsorDetail.email,
        committedMoney: sponsorDetail.fundMoney,
        payment: sponsorDetail.fundMoneyReal,
        status: sponsorDetail.status == 1 ? true : false,
      });
    }
  }, [sponsorDetail]);

  const checkPrice = (_, value) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject();
  };

  const submitForm = async (value) => {
    try {
      setUpdateLoading(true);
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.put(
        `${config.host}/admin/member/${sponsorId}`,
        {
          status: value.status,
          fundMoney: value.committedMoney,
        },
        { headers: headers }
      );
      if (res.data.status == true) {
        message.info("Thêm thông tin thành công!");
        setCheckUpdateTable(!checkUpdateTable);
        setUpdateLoading(false);
      } else if (res.data.status == "warning") {
        message.warning(res.data.mess);
        setUpdateLoading(false);
      } else {
        openNotificationWithIcon("warning");
        setUpdateLoading(false);
      }
    } catch (error) {
      console.error("Lỗi:", error.message || error);
    } finally {
      setUpdateLoading(false);
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
      const res = await axios.get(config.host + `/admin/delete-pdf/${id}`, {
        headers: headers,
      });

      if (res.data.status === true) {
        message.success("Xóa file pdf hợp đồng thành công.");
        const updateContractList = dataContracts.filter(
          (item) => item.id !== id
        );
        setDataContracts(updateContractList);
      } else {
        message.error("Xóa file pdf hợp đồng thất bại.");
      }
    } catch (error) {}
  };

  // const handleDowloadPdf = async () => {
  //   let headers = {
  //     "Content-Type": "application/json",
  //   };
  //   const token = localStorage.getItem("adminvtnk");

  //   if (token) {
  //     headers.Authorization = `Bearer ${token}`;
  //   }
  //   await axios({
  //     url: `${config.host}/admin/export-pdf/${sponsorId}`,
  //     method: "GET",
  //     responseType: "blob",
  //     headers: headers,
  //   })
  //     .then((response) => {
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", "hop-dong-tai-tro.pdf");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  const data = dataContracts?.map((item) => ({
    id: item.id,
    url: item.contractDPF,
    name: item.name,
    createDate: item.date,
  }));

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
      {isLoading ? (
        <div className="w-100 text-center">
          <Spin />{" "}
        </div>
      ) : (
        <CContainer>
          <CRow className="justify-content-between align-items-center">
            <CCol>
              <h3>THÔNG TIN NGƯỜI ĐÓNG GÓP</h3>
            </CCol>

            {/* <Button
              disabled={sponsorDetail.status === 1 ? false : true}
              type="primary"
              onClick={handleDowloadPdf}
            >
              Tải về hợp đồng tài trợ
            </Button> */}
          </CRow>
          <CRow className="mt-3">
            <h5>Thông tin mạnh thường quân</h5>
            <CCol className="mt-2">
              <Form
                onFinish={submitForm}
                form={form}
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
              >
                <Form.Item label="Họ và tên:" name="sponsorName">
                  <Input readOnly={true} />
                </Form.Item>

                <Form.Item label="Email:" name="sponsorEmail">
                  <Input readOnly={true} />
                </Form.Item>

                <Form.Item label="Số điện thoại:" name="sponsorPhone">
                  <Input readOnly={true} />
                </Form.Item>

                <Form.Item label="Tên công ty:" name="companyName">
                  <Input readOnly={true} />
                </Form.Item>

                <Form.Item label="Địa chỉ công ty:" name="companyAddress">
                  <Input readOnly={true} />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Nhập số tiền cam kết!",
                      validator: checkPrice,
                    },
                  ]}
                  label="Tiền cam kết:"
                  name="committedMoney"
                >
                  <NumberInput />
                </Form.Item>

                <Form.Item
                  rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
                  label="Trạng thái:"
                  name="status"
                >
                  <Radio.Group>
                    <Radio value={true}>Duyệt</Radio>
                    <Radio value={false}>Chưa duyệt</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item className="text-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updateLoading}
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <h3>Danh sách hồ sơ góp quỹ</h3>
            <div className="mt-3">
              <Upload {...props} accept=".pdf">
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
              <Button
                type="primary"
                onClick={handleNewUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? "Đang upload file" : "Upload hợp đồng"}
              </Button>
            </div>

            <div className="mb-5">
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    <List.Item.Meta
                      style={{ maxWidth: "600px" }}
                      title={
                        <a
                          target="blank
                      "
                          href={`${config.contract}${item.url}`}
                        >
                          {item.name}
                        </a>
                      }
                      description={`Ngày upload: ${item.createDate}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          </CRow>

          <ContributeMoney
            checkPrice={checkPrice}
            setCheckUpdateTable={setCheckUpdateTable}
            checkUpdateTable={checkUpdateTable}
            nameMember={sponsorDetail.username}
            sponsorId={sponsorId}
          />
        </CContainer>
      )}
    </>
  );
}

export default SponsorDetail;
