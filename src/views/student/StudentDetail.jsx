import ParentForm from "../../components/ParentForm";
import GuadianForm from "../../components/GuardianForm";
import StudentForm from "../../components/StudentForm";
import {
  Button,
  Form,
  List,
  Popconfirm,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import DebtMoney from "./DebtMoney";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import config from "../../config";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import { CCol, CContainer, CRow } from "@coreui/react";
import TableTaskStudent from "./tableTaskStudent";

function StudentDetail() {
  const [checkGuardian, setCheckGuardian] = useState(1);
  const [detailStudent, setDetailStudent] = useState([]);
  const [memberInfo, setMemberInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [loanValue, setLoanValue] = useState("");

  const [isLoanChange, setIsLoanChange] = useState();
  const [status, setStatus] = useState();
  const { studentId } = useParams();
  const [form] = useForm();

  const [dataContracts, setDataContracts] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [checkViewPermission, setCheckViewPermission] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  useEffect(() => {
    setLoading(true);
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
      const res = await axios.get(
        config.host + `/admin/student/${studentId}/edit`,
        {
          headers: headers,
        }
      );
      setDetailStudent(res.data.data);
      setMemberInfo(res.data.member);
      setDataContracts(res.data.dataContract);

      setCheckGuardian(res.data.relationship);
      setLoanValue(res.data.loan);
      setLoading(false);

      if (res.data.mess == "no permission") {
        setCheckViewPermission(true);
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  const handleFinish = async (values) => {
    setUpdateLoading(true);
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.put(
        `${config.host}/admin/student/${studentId}`,
        {
          reason: values.loanReason,
          deadline: values.refundPeriod,
          status: values.status,
          loan: values.studentDebt,
        },
        { headers: headers }
      );
      if (res.data.status === true) {
        message.info("Thêm thông tin thành công!");
      } else if (res.data.status == "warning") {
        message.warning(res.data.mess);
      } else {
        openNotificationWithIcon("warning");
      }
    } catch (error) {
      console.error("Lỗi:", error.message || error);
    } finally {
      setUpdateLoading(false);
    }
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
      url: `${config.host}/admin/update-student-pdf/${studentId}`,
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

  const handleDelete = async (id) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(
        config.host + `/admin/delete-student-pdf/${id}`,
        {
          headers: headers,
        }
      );

      if (res.data.status === true) {
        message.success("Xóa file pdf hợp đồng thành công.");
        const updateContractList = dataContracts.filter(
          (item) => item.id !== id
        );
        setDataContracts(updateContractList);
      } else {
        message.error("Xóa file pdf hợp đồng thất bại.");
      }
    } catch (error) {
      console.error("fail to fetch data.");
    }
  };

  const handleDowloadPdf = async () => {
    let headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("adminvtnk");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    await axios({
      url: `${config.host}/admin/export-student-pdf/${studentId}`,
      method: "GET",
      responseType: "blob",
      headers: headers,
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "hop-dong-vay.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
      {loading ? (
        <div className="w-100 text-center">
          <Spin />{" "}
        </div>
      ) : (
        <CContainer>
          <CRow>
            <CCol md={12}>
              <div className="d-flex justify-content-between align-items-center">
                <h3>THÔNG TIN NGƯỜI NHẬN</h3>
                {/* <Button
              disabled={detailStudent.status === 1 ? false : true}
              type="primary"
              onClick={handleDowloadPdf}
            >
              Tải về hợp đồng vay
            </Button> */}
              </div>

              {checkGuardian === 1 ? (
                <ParentForm detailStudent={detailStudent} />
              ) : (
                <GuadianForm detailStudent={detailStudent} />
              )}
              <StudentForm
                form={form}
                detailStudent={detailStudent}
                memberInfo={memberInfo}
                propStatus={setStatus}
                onFinish={handleFinish}
                // loanValue={loanValue}
                // isLoanChange={isLoanChange}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  loading={updateLoading}
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Cập nhật
                </Button>
              </div>
            </CCol>

            <CCol md={12}>
              <div className="mb-3 mt-5">
                <h3>Danh sách hồ sơ xét duyệt học bổng</h3>
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
              </div>
              <div className="mb-5">
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(item, index) => (
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
            </CCol>

            <CCol md={12}>
              <TableTaskStudent id={studentId} />
            </CCol>

            <CCol md={12}>
              <DebtMoney
                nameStudent={detailStudent?.nameMember}
                studentId={studentId}
                propLoanChange={setIsLoanChange}
              />
            </CCol>
          </CRow>
        </CContainer>
      )}
    </>
  );
}

export default StudentDetail;
