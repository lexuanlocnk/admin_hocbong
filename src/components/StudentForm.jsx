import { Form, Input, DatePicker, Radio } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { CButton, CCol, CContainer, CRow } from "@coreui/react";
import { Link } from "react-router-dom";

function StudentForm({
  detailStudent,
  propLoanReason,
  propRefundPeriod,
  propStatus,
  form,
  onFinish,
  isLoanChange,
  loanValue,
}) {
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  function onSelectDate(date, dateString) {
    propRefundPeriod(dateString);
  }

  useEffect(() => {
    if (isEmptyObject(detailStudent) == false) {
      form.setFieldsValue({
        studentName: detailStudent.nameMember,
        studentAddress: detailStudent.addressMember,
        studentDob: detailStudent.dateBirthMember,
        studentTel: detailStudent.phoneMember,
        studentIdCard: detailStudent.IDMember,
        studentSchool: detailStudent.schoolMember,
        studentDebt: loanValue,
        studentTransaction: detailStudent.code,
        studentEmail: detailStudent.emailMember,
        loanReason: detailStudent.reason,
        status: detailStudent.status,
      });
    }
  }, []);

  return (
    <CContainer>
      <CRow>
        <CCol md={12}>
          <h5>Thông tin sinh viên</h5>
        </CCol>
        <CCol>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="Họ tên sinh viên:" name="studentName">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item label="Địa chỉ:" name="studentAddress">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item label="Ngày tháng năm sinh:" name="studentDob">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item label="Số điện thoại: " name="studentTel">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item label="Số CCCD/CMND:" name="studentIdCard">
              <Input readOnly={true} />
            </Form.Item>
            <Form.Item label="Tên trường đang học:" name="studentSchool">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item label="Mã giao dịch:" name="studentTransaction">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item label="Email:" name="studentEmail">
              <Input readOnly={true} />
            </Form.Item>

            {/* <Form.Item label="Số tiền vay:" name="studentDebt">
            <Input />
          </Form.Item> */}

            <Form.Item label="Lý do nhận học bổng:" name="loanReason">
              <TextArea
                rows={4}
                onChange={(e) => propLoanReason(e.target.value)}
              />
            </Form.Item>

            {/* <Form.Item
            rules={[
              {
                required: true,
                message: "Hãy chọn thời gian hoàn trả!",
              },
            ]}
            label="Thời gian hoàn trả:"
            name="refundPeriod"
          >
            <DatePicker
              // disabled={detailStudent.deadline ? true : false}
              placeholder={"Thời gian hoàn trả"}
              defaultValue={dayjs(
                detailStudent.deadline ? detailStudent.deadline : "01/01/2024",
                "DD/MM/YYYY"
              )}
              format={"DD/MM/YYYY"}
              onChange={onSelectDate}
            />
          </Form.Item> */}

            <Form.Item
              rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
              label="Trạng thái:"
              name="status"
            >
              <Radio.Group onChange={(e) => propStatus(e.target.value)}>
                <Radio value={1}>Duyệt</Radio>
                <Radio value={0}>Chưa duyệt</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default StudentForm;
