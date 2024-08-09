import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  Upload,
  message,
  notification,
} from "antd";
import axios from "axios";
import config from "../../config";
import { currentcyFormat } from "../../services/currencyFormat";
import InputNumberCustom from "../../components/inputNumberCustom";
import { UploadOutlined } from "@ant-design/icons";

const ContributeMoney = ({
  nameMember,
  sponsorId,
  checkUpdateTable,
  setCheckUpdateTable,
  checkPrice,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState("");
  const [dataMoney, setDataMoney] = useState("");
  const [isModalAddInfoOpen, setIsModalAddInfoOpen] = useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState("");

  const [contributionAmount, setContributionAmount] = useState(0);

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

  useEffect(() => {
    setLoading(true);
    form.setFieldsValue({
      memberName: nameMember,
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
        config.host + `/admin/show-member-money/${sponsorId}?page=${page}`,
        {
          headers: headers,
        }
      );

      const data = res.data.data.data;
      setDataMoney(res.data);
      setDataSource(data);
      setTotal(res.data.data.total);
      setLoading(false);
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  const handleSubmitForm = async () => {
    setUploading(true);
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

      if (contributionAmount > 0 && !isNaN(contributionAmount)) {
        const res = await axios.post(
          `${config.host}/admin/update-money/${sponsorId}`,
          {
            fundMoneyReal: contributionAmount,
            filePdf: currentFile,
          },
          { headers: headers }
        );
        if (res.data.status == true) {
          message.info("Thêm thông tin thành công!");
          setCheckUpdateTable(!checkUpdateTable);
          setIsModalAddInfoOpen(false);
          setContributionAmount("");
          setFileList([]);
        } else if (res.data.status == "warning") {
          message.warning(res.data.mess);
        } else {
          openNotificationWithIcon("warning");
        }
      } else if (isNaN(contributionAmount)) {
        message.info("Số tiền đã trả không được nhập ký tự!");
      } else {
        message.warning("Số tiền đã trả không được bé hơn 0!");
      }
      setUploading(false);
    } catch (error) {
      console.error("Lỗi:", error.message || error);
    }
  };

  const columns = [
    {
      title: "Tên doanh nghiệp",
      dataIndex: "username",
      key: "nameMember",
    },
    {
      title: "Mã phiếu thu",
      dataIndex: "code",
      key: "receiptCode",
    },
    {
      title: "Số tiền góp",
      dataIndex: "fundMoneyReal",
      key: "realAmount",
      render: (text, record) => {
        return record.fundMoneyReal;
      },
    },
    {
      title: "Ngày góp",
      dataIndex: "dates",
      key: "dateContribute",
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

  const handleCancel = () => {
    setIsModalAddInfoOpen(false);
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

  return (
    <>
      {contextHolder}
      <div>
        <h3>QUẢN LÝ TIỀN GÓP</h3>
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between">
            <Button
              onClick={() => {
                form.resetFields(["fundMoneyReal"]);
                setIsModalAddInfoOpen(true);
              }}
              type="primary"
              style={{ marginBottom: 16 }}
              loading={uploading}
            >
              Thêm thông tin
            </Button>
            {!loading && (
              <div>
                <h6>
                  Tiền cam kết:{" "}
                  {dataMoney && currentcyFormat(dataMoney.commitmentMoney)}
                </h6>
                <h6>
                  Tiền thực góp:{" "}
                  {dataMoney && currentcyFormat(dataMoney.actualPayment)}
                </h6>
                <h6>
                  Tiền còn lại:{" "}
                  {dataMoney && currentcyFormat(dataMoney.remainingMoney)}
                </h6>
              </div>
            )}
          </div>
          <div>
            <Table
              rowClassName={() => "editable-row"}
              bordered
              dataSource={dataSource}
              columns={columns}
              loading={loading}
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
                  label="Tên doanh nghiệp"
                  name="memberName"
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
                  label="Số tiền thực góp"
                  name="fundMoneyReal"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập số tiền thực góp!",
                      validator: checkPrice,
                    },
                  ]}
                >
                  <InputNumberCustom
                    number={contributionAmount}
                    setNumber={setContributionAmount}
                  />
                </Form.Item>

                {/* <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Popconfirm
                    title="Xác nhận thông tin"
                    onConfirm={() => handleSubmitForm(form.getFieldValue())}
                    okText="Xác Nhận"
                    cancelText="Không"
                  >
                    <Button danger htmlType="submit">
                      {" "}
                      Lưu thông tin
                    </Button>
                  </Popconfirm>
                </Form.Item> */}
              </Form>

              {/* <div className="mt-3">
                <Row>
                  <Col span={8}>Số tiền thực góp:</Col>
                  <Col span={16}>
                    <InputNumberCustom
                      number={contributionAmount}
                      setNumber={setContributionAmount}
                    />
                  </Col>
                </Row>
              </div> */}

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
      </div>
    </>
  );
};

export default ContributeMoney;
