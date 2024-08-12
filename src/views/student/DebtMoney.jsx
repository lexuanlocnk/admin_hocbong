import { useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  message,
  notification,
  Row,
  Col,
  Upload,
  Tooltip,
  DatePicker,
} from "antd";
import axios from "axios";
import config from "../../config";
import InputNumberCustom from "../../components/inputNumberCustom";
import { UploadOutlined } from "@ant-design/icons";
import { CCol, CContainer, CRow } from "@coreui/react";
import moment from "moment";
import { currentcyFormat } from "../../services/currencyFormat";

const DebtMoney = ({ studentId, nameStudent, propLoanChange }) => {
  const [checkUpdateTable, setCheckUpdateTable] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalAddInfoOpen, setIsModalAddInfoOpen] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState("");

  const [amountPaid, setAmountPaid] = useState(0);
  const [receivedDate, setReceivedDate] = useState(null);

  // check new upload
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const handleCancel = () => {
    setIsModalAddInfoOpen(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      nameStudent: nameStudent,
    });

    fetchData(1);
  }, [checkUpdateTable]);

  const fetchData = async (page) => {
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
        config.host +
          `/admin/show-student-money/${studentId}?page=${page}&size=5`,
        {
          headers: headers,
        }
      );
      if (res.data.status === true) {
        const data = res.data.data.data;
        setDataTable(res.data.data.data);
        setTotal(res.data.data.total);
        setLoading(false);
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  const columns = [
    {
      title: "Mã phiếu thu	",
      dataIndex: "code",
      key: "receiptCode",
    },
    {
      title: "Số tiền đã nhận",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (text, record) => {
        return currentcyFormat(record?.moneyPaid);
      },
    },
    {
      title: "Ngày thực nhận",
      dataIndex: "receiveDates",
      key: "receiveDates",
      render: (text, record) => {
        return moment
          .unix(parseInt(record?.datesReceived))
          .format("DD-MM-YYYY");
      },
    },
    {
      title: "Ngày tạo phiếu",
      dataIndex: "dates",
      key: "payDay",
    },

    {
      title: "Bản scan PDF phiếu thu",
      dataIndex: "contract",
      key: "contract",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        return record.contract && record.contract !== null ? (
          <Tooltip placement="left" title={record.nameContract}>
            <a target="_blank" href={`${config.contract}${record.contract}`}>
              {record.nameContract}
            </a>
          </Tooltip>
        ) : (
          "Không có link"
        );
      },
    },
  ];

  const handleAdd = () => {
    setIsModalAddInfoOpen(true);
  };

  const handleDateChange = (date, dateString) => {
    setReceivedDate(dateString);
  };

  const handleSubmitForm = async (value) => {
    try {
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

      if (amountPaid > 0 && !isNaN(amountPaid)) {
        const res = await axios.post(
          `${config.host}/admin/update-student-money/${studentId}`,
          {
            moneyPaid: amountPaid,
            filePdf: currentFile,
            datesReceived: receivedDate,
          },
          { headers: headers }
        );

        if (res.data.status == "success") {
          message.info("Thêm thông tin thành công!");
        } else if (res.data.status === "warning") {
          message.warning(res.data.mess);
        } else {
          openNotificationWithIcon("warning");
        }
        setCheckUpdateTable(!checkUpdateTable);
      } else if (isNaN(amountPaid)) {
        message.info("Số tiền nhận không được nhập ký tự!");
      } else {
        message.info("Số tiền nhận không được bé hơn 0!");
      }
    } catch (error) {
      console.error("Lỗi:", error.message || error);
    }
  };

  // const checkPrice = (_, value) => {
  //   console.log(value);
  //   if (value.number > 0) {
  //     return Promise.resolve();
  //   }
  //   return Promise.reject(new Error("Price must be greater than zero!"));
  // };

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

  return (
    <>
      {contextHolder}
      <CContainer>
        <CRow>
          <CCol md={6}>
            <h3>QUẢN LÝ TIỀN NHẬN</h3>
          </CCol>
          <CCol md={6}>
            <div className="d-flex justify-content-end">
              <Button
                onClick={handleAdd}
                type="primary"
                style={{ marginBottom: 16 }}
              >
                Thêm thông tin
              </Button>
            </div>
          </CCol>
        </CRow>

        <div className="w-100">
          <div>
            <Table
              rowClassName={() => "editable-row"}
              bordered
              loading={loading}
              dataSource={dataTable}
              columns={columns}
              pagination={{
                pageSize: 5,
                total: total,
                onChange: (page) => {
                  fetchData(page);
                },
              }}
            />
            <Modal
              title="Thêm thông tin"
              onCancel={handleCancel}
              open={isModalAddInfoOpen}
              footer={null}
            >
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                autoComplete="off"
              >
                <Form.Item
                  label="Tên sinh viên"
                  name="nameStudent"
                  rules={[
                    {
                      type: "regexp",
                      required: true,
                      message: "Hãy nhập tên sinh viên",
                    },
                  ]}
                >
                  <Input readOnly={true} />
                </Form.Item>

                <Form.Item
                  label="Số tiền nhận"
                  name="amountPaid"
                  rules={[
                    {
                      // validator: checkPrice,

                      required: true,
                      message: "Hãy nhập số tiền nhận!",
                    },
                  ]}
                >
                  <InputNumberCustom
                    number={amountPaid}
                    setNumber={setAmountPaid}
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày thực nhận"
                  name="receivedDate"
                  rules={[
                    {
                      required: true,
                      message: "Hãy chọn ngày thực nhận!",
                    },
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Form>

              <div className="mt-3">
                <Row>
                  <Col span={8}>Upload pdf phiếu thu:</Col>
                  <Col span={16}>
                    <Upload {...props} accept=".pdf">
                      <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                    </Upload>
                  </Col>
                </Row>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <Popconfirm
                  title="Xác nhận thông tin?"
                  onConfirm={handleSubmitForm}
                  okText="Xác Nhận"
                  cancelText="Không"
                >
                  <Button danger> Lưu thông tin</Button>
                </Popconfirm>
              </div>
            </Modal>
          </div>
        </div>
      </CContainer>
    </>
  );
};

export default DebtMoney;
