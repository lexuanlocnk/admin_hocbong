import React, { useEffect, useState } from "react";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from "@coreui/react";
import { Link } from "react-router-dom";

import axios from "axios";
import CKedtiorCustom from "../../components/customEditor/customEditor";
import { DatePicker, message, notification } from "antd";
import moment from "moment";
import config from "../../config";
import { cibKlout } from "@coreui/icons";

function AddPost() {
  const [editor, setEditor] = useState("");

  const initialValues = {
    title: "",
    friendlyUrl: "",
    metaKeyword: "",
    metaDesc: "",
    visible: 0,
  };

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  const validateDates = (start, end) => {
    if (!start || !end) {
      return "Vui lòng chọn cả hai ngày.";
    }
    if (end.isBefore(start)) {
      return "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.";
    }
    return "";
  };

  const onChangeStartDate = (date, dateString) => {
    const start = date ? moment(dateString, "DD/MM/YYYY") : null;
    setStartDate(start);
    const errorMsg = validateDates(start, endDate);
    setError(errorMsg);
  };

  const onChangeEndDate = (date, dateString) => {
    const end = date ? moment(dateString, "DD/MM/YYYY") : null;
    setEndDate(end);
    const errorMsg = validateDates(startDate, end);
    setError(errorMsg);
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(6, "Tối thiểu 6 ký tự")
      .required("Tên đợt phát hành là bắt buộc."),
    friendlyUrl: Yup.string().required("Chuỗi đường dẫn là bắt buộc."),
    metaKeyword: Yup.string().required("Meta keywords là bắt buộc."),
    metaDesc: Yup.string().required("Meta description là bắt buộc."),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${config.host}/admin/task`,
        {
          title: values.title,
          friendlyUrl: values.friendlyUrl,
          metakeywords: values.metaKeyword,
          metadesc: values.metaDesc,
          display: values.visible,
          startdate: startDate,
          enddate: endDate,
          description: editor,
        },
        {
          headers: config.headers,
        }
      );

      if (response.data.status === true) {
        message.success("Thêm mới nhiệm vụ thành công!");
      } else if ((response.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
      }
    } catch (error) {
      console.log("Post data tast is error", error);
    }
  };

  return (
    <>
      {contextHolder}
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h3>THÊM MỚI NHIỆM VỤ</h3>
          </CCol>
          <CCol md={{ span: 4, offset: 4 }}>
            <div className="d-flex justify-content-end">
              <Link to={`/post`}>
                <CButton color="primary" type="submit" size="sm">
                  Danh sách
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>

        <CRow>
          <CCol md={8}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="title-input">Tên đợt phát hành</label>
                    <Field
                      name="title"
                      type="text"
                      as={CFormInput}
                      id="title-input"
                      text="Tối thiểu 6 ký tự."
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-danger"
                    />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <CFormLabel clas>Chọn ngày hoàn thành :</CFormLabel>
                    <div className="d-flex gap-2 align-items-center">
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        onChange={onChangeStartDate}
                      />
                      {"đến ngày"}
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        onChange={onChangeEndDate}
                      />
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <CFormLabel>Mô tả chi tiết nhiệm vụ</CFormLabel>
                    <CKedtiorCustom
                      data={editor}
                      onChangeData={(data) => setEditor(data)}
                    />
                  </CCol>
                  <br />

                  <h6>Search Engine Optimization</h6>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="url-input">Chuỗi đường dẫn</label>
                    <Field
                      name="friendlyUrl"
                      type="text"
                      as={CFormInput}
                      id="url-input"
                      text="Chuỗi dẫn tĩnh là phiên bản của tên hợp chuẩn với Đường dẫn (URL). Chuỗi này bao gồm chữ cái thường, số và dấu gạch ngang (-). VD: vi-tinh-nguyen-kim-to-chuc-su-kien-tri-an-dip-20-nam-thanh-lap"
                    />
                    <ErrorMessage name="friendlyUrl" component="div" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="metaKeyword-input">Meta keywords</label>
                    <Field
                      name="metaKeyword"
                      type="text"
                      as={CFormInput}
                      id="metaKeyword-input"
                      text="Độ dài của meta keywords chuẩn là từ 100 đến 150 ký tự, trong đó có ít nhất 4 dấu phẩy (,)."
                    />
                    <ErrorMessage
                      name="metaKeyword"
                      component="div"
                      className="text-danger"
                    />
                  </CCol>

                  <br />
                  <CCol md={12}>
                    <label htmlFor="metaDesc-input">Meta description</label>
                    <Field
                      name="metaDesc"
                      type="text"
                      as={CFormInput}
                      id="metaDesc-input"
                      text="Thẻ meta description chỉ nên dài khoảng 140 kí tự để có thể hiển thị hết được trên Google. Tối đa 200 ký tự."
                    />
                    <ErrorMessage
                      name="metaDesc"
                      component="div"
                      className="text-danger"
                    />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Hiển thị</label>
                    <Field
                      className="w-50"
                      name="visible"
                      as={CFormSelect}
                      id="visible-select"
                      // size="sm"
                      options={[
                        { label: "Không", value: 0 },
                        { label: "Có", value: 1 },
                      ]}
                    />
                    <ErrorMessage
                      name="visible"
                      component="div"
                      className="text-danger"
                    />
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      Thêm mới
                    </CButton>
                  </CCol>
                </Form>
              )}
            </Formik>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
}

export default AddPost;
