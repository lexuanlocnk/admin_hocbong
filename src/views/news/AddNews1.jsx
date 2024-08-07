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
  CFormTextarea,
  CImage,
  CRow,
} from "@coreui/react";
import { Link } from "react-router-dom";

import axios from "axios";
import CKedtiorCustom from "../../components/customEditor/customEditor";
import { DatePicker, message } from "antd";
import config from "../../config";

function AddPost() {
  const [messageApi, contextHolder] = message.useMessage();
  const [editor, setEditor] = useState("");

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState("");
  const [file, setFile] = useState([]);

  const initialValues = {
    title: "",
    shortDesc: "",
    pageTitle: "",
    friendlyUrl: "",
    metaKeyword: "",
    metaDesc: "",
    category: 1,
    visible: 2,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(6, "Tối thiểu 6 ký tự")
      .required("Tên đợt phát hành là bắt buộc."),
    friendlyUrl: Yup.string().required("Chuỗi đường dẫn là bắt buộc."),
    metaKeyword: Yup.string().required("Meta keywords là bắt buộc."),
    metaDesc: Yup.string().required("Meta description là bắt buộc."),
  });

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

  const handleSubmit = async (values) => {
    console.log(">>> check values news: ", values);

    try {
      const response = await axios.post(
        `${config.host}/admin/news`,
        {
          title: values.title,
          short: values.shortDesc,
          url: values.friendlyUrl,
          titleDesc: values.pageTitle,
          metaKeyword: values.metaKeyword,
          metaDescription: values.metaDesc,
          cateNews: values.category,
          display: values.visible,
          contentNews: editor,
          picture: selectedFile,
        },
        {
          headers: config.headers,
        }
      );
      if (response.data.status === true) {
        messageApi.open({
          type: "success",
          content: "Thêm mới tin tức thành công!",
        });
      }
    } catch (error) {
      console.log("Post data news is error", error);
      messageApi.open({
        type: "error",
        content: "Đã xảy ra lỗi. Vui lòng thử lại!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h3>THÊM MỚI TIN TỨC</h3>
          </CCol>
          <CCol md={{ span: 4, offset: 4 }}>
            <div className="d-flex justify-content-end">
              <Link to={`/news`}>
                <CButton color="primary" type="submit" size="sm">
                  Danh sách
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <CRow>
                    <CCol md={9}>
                      <CCol md={12}>
                        <label htmlFor="title-input">Tiêu đề</label>
                        <Field
                          name="title"
                          type="text"
                          as={CFormInput}
                          id="title-input"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <CFormLabel>Mô tả chi tiết</CFormLabel>
                        <CKedtiorCustom
                          data={editor}
                          onChangeData={(data) => setEditor(data)}
                        />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="shortDesc">Mô tả ngắn</label>
                        <Field
                          name="shortDesc"
                          type="text"
                          as={CFormTextarea}
                          id="shortDesc"
                        />
                        <ErrorMessage name="shortDesc" component="div" />
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
                        <label htmlFor="pageTitle-input">Tiêu đề trang</label>
                        <Field
                          name="pageTitle"
                          type="text"
                          as={CFormInput}
                          id="pageTitle-input"
                          text="Độ dài của tiêu đề trang tối đa 60 ký tự."
                        />
                        <ErrorMessage name="pageTitle" component="div" />
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
                    </CCol>

                    <CCol md={3}>
                      <CCol md={12}>
                        <label htmlFor="category-select">Danh mục</label>
                        <Field
                          name="category"
                          as={CFormSelect}
                          id="category-select"
                          // size="sm"
                          options={[
                            { label: "Tin nội bộ", value: 1 },
                            { label: "Hoạt động quỹ", value: 2 },
                          ]}
                        />
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <CFormInput
                          name="picture"
                          type="file"
                          id="formFile"
                          label="Hình ảnh đại diện"
                          onChange={(e) => onFileChange(e)}
                          size="sm"
                        />
                        <br />
                        <ErrorMessage
                          name="picture"
                          component="div"
                          className="text-danger"
                        />

                        <div>
                          {file.length == 0 ? (
                            <div>
                              <CImage
                                className="border"
                                src={
                                  `http://192.168.245.180:8000/uploads/` +
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
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="visible-select">Hiển thị</label>
                        <Field
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
                    </CCol>
                  </CRow>
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
