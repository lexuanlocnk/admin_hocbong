import React from "react";
import { Form, Input } from "antd";
import { useEffect } from "react";


function ParentForm({ detailStudent }) {
  const [formFather] = Form.useForm();
  const [formMother] = Form.useForm();


  useEffect(() => {
    if (detailStudent) {
      formFather.setFieldsValue({
        fatherName: detailStudent.nameFather,
        fatherAddress: detailStudent.addressFather,
        fatherDob: detailStudent.dateBirthFather,
        fatherTel: detailStudent.phoneFather,
        fatherIdCard: detailStudent.IDFather,
        fatherEmail: detailStudent.emailFather,

      });

      formMother.setFieldsValue({
        motherName: detailStudent.nameMother,
        motherAddress: detailStudent.addressMother,
        motherDob: detailStudent.dateBirthMother,
        motherTel: detailStudent.phoneMother,
        motherIdCard: detailStudent.IDMother,
        motherEmail: detailStudent.emailMother,

      });


    }
  }, []);

  return (
    <div>
      <div>
        <div
          style={{
            textAlign: "left",
            fontSize: "18px",
            fontWeight: "500",
            marginBottom: 16,
          }}
        >
          Thông tin cha:
        </div>
        <div>
          <Form
            form={formFather}

            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 23 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item  label="Họ tên cha:" name="fatherName">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Địa chỉ:" name="fatherAddress">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Ngày tháng năm sinh:" name="fatherDob">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Số điện thoại: " name="fatherTel">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Số CCCD/CMND:" name="fatherIdCard">
              <Input    readOnly={true}/>
            </Form.Item>

            <Form.Item label="Email:" name="fatherEmail">
              <Input   readOnly={true} />
            </Form.Item>
          </Form>
        </div>
      </div>

      <div>
        <div
          style={{
            textAlign: "left",
            fontSize: "18px",
            fontWeight: "500",
            marginBottom: 16,
          }}
        >
          Thông tin mẹ:
        </div>
        <div>
          <Form
            form={formMother}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 23 }}
            initialValues={{ remember: true }}

            autoComplete="off"
          >
            <Form.Item label="Họ tên mẹ:" name="motherName">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Địa chỉ:" name="motherAddress">
              <Input    readOnly={true} />
            </Form.Item>

            <Form.Item label="Ngày tháng năm sinh:" name="motherDob">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Số điện thoại: " name="motherTel">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Số CCCD/CMND:" name="motherIdCard">
              <Input   readOnly={true} />
            </Form.Item>

            <Form.Item label="Email:" name="motherEmail">
              <Input   readOnly={true} />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ParentForm;
