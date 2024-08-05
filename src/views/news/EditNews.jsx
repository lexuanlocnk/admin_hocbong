// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// // import Editor from "ckeditor5-custom-build";
// import { Button, Checkbox, Form, Input } from "antd";
// import { message, Upload } from "antd";
// import { Select, Row, Col } from "antd";

// import "../../css/AddNews.css";

// import { UploadOutlined } from "@ant-design/icons";

// const { TextArea } = Input;
// const options = [
//   { label: "Tin nội bộ", value: "tin-noi-bo" },
//   { label: "Hoạt động quỹ", value: "hoat-dong-quy" },
// ];

// const props = {
//   name: "file",
//   action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
//   headers: {
//     authorization: "authorization-text",
//   },
//   onChange(info) {
//     if (info.file.status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };

// function EditNews() {
//   const onFinish = (values) => {
//     console.log("Success:", values);
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };

//   const onChange = (checkedValues) => {
//     console.log("checked = ", checkedValues);
//   };

//   const handleChange = (value) => {
//     console.log(`selected ${value}`);
//   };
//   return (
//     <>
//       <h1 style={{ textTransform: "uppercase" }}>Cập nhật tin tức mới</h1>
//       <Row style={{ justifyContent: "space-between" }}>
//         <Col span={18}>
//           <Form
//             name="basic"
//             labelCol={{ span: 4 }}
//             wrapperCol={{ span: 20 }}
//             initialValues={{ remember: true }}
//             // style={{ maxWidth: "900px" }}
//             onFinish={onFinish}
//             onFinishFailed={onFinishFailed}
//             autoComplete="off"
//           >
//             <Form.Item label="Tiêu đề" name="title">
//               <Input />
//             </Form.Item>

//             <div style={{ marginLeft: "130px" }}>
//               <CKEditor
//                 editor={ClassicEditor}
//                 data="<p>Hello from CKEditor&nbsp;5!</p>"
//                 onReady={(editor) => {
//                   // Editor is ready to use
//                   console.log("Editor is ready to use!", editor);
//                 }}
//                 onChange={(event, editor) => {
//                   // Handle content changes
//                   console.log("Content change", editor.getData());
//                 }}
//               />
//             </div>

//             <Form.Item label="Mô tả ngắn" name="title">
//               <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
//             </Form.Item>

//             <Form.Item label="Chuỗi đường dẫn" name="title">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Tiêu đề trang" name="title">
//               <Input />
//             </Form.Item>

//             <Form.Item label="Meta keywords" name="title">
//               <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
//             </Form.Item>

//             <Form.Item label="Meta description" name="title">
//               <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
//             </Form.Item>
//           </Form>
//         </Col>

//         <Col span={4}>
//           <div>
//             <h2>Danh mục</h2>
//             <Checkbox.Group
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 rowGap: "8px",
//               }}
//               options={options}
//               defaultValue={["Pear"]}
//               onChange={onChange}
//             />
//           </div>
//           <div>
//             <div style={{ marginTop: 20 }}>
//               <Upload {...props}>
//                 <Button icon={<UploadOutlined />}>Click to Upload</Button>
//               </Upload>
//             </div>

//             <div>
//               <div style={{ marginTop: "20px", marginBottom: "16px" }}>
//                 Cho phép hiển thị
//               </div>
//               <Select
//                 style={{ minWidth: "150px" }}
//                 defaultValue="Có"
//                 onChange={handleChange}
//                 options={[
//                   { value: "1", label: "Có" },
//                   { value: "0", label: "Không" },
//                   { value: "disabled", label: "Disabled", disabled: true },
//                 ]}
//               />
//             </div>
//             <Button style={{ marginTop: "16px" }} type="primary">
//               Thêm mới
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </>
//   );
// }

// export default EditNews;
