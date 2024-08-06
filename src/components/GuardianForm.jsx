import React, { useEffect } from "react";
import { Form, Input } from "antd";
import { CCol, CContainer, CRow } from "@coreui/react";

function GuadianForm({ detailStudent }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (detailStudent) {
      form.setFieldsValue({
        guardianName: detailStudent.nameGuardian,
        guardianAddress: detailStudent.addressGuardian,
        guardianDob: detailStudent.dateBirthGuardian,
        guardianTel: detailStudent.phoneGuardian,
        guardianIdCard: detailStudent.IDGuardian,
        guardianEmail: detailStudent.emailGuardian,
      });
    }
  }, []);

  return (
    <CContainer>
      <CRow>
        <CCol>
          <div
            style={{
              textAlign: "left",
              fontSize: "18px",
              fontWeight: "500",
              marginBottom: 16,
            }}
          >
            Thông tin người giám hộ:
          </div>
          <div>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              form={form}
              autoComplete="off"
            >
              <Form.Item label="Họ tên người giám hộ:" name="guardianName">
                <Input />
              </Form.Item>

              <Form.Item label="Địa chỉ:" name="guardianAddress">
                <Input />
              </Form.Item>

              <Form.Item label="Ngày tháng năm sinh:" name="guardianDob">
                <Input />
              </Form.Item>

              <Form.Item label="Số điện thoại: " name="guardianTel">
                <Input />
              </Form.Item>

              <Form.Item label="Số CCCD/CMND:" name="guardianIdCard">
                <Input />
              </Form.Item>

              <Form.Item label="Email:" name="guardianEmail">
                <Input />
              </Form.Item>
            </Form>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default GuadianForm;
