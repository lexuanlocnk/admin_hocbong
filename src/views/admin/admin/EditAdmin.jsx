import { useEffect, useState } from "react";
import "../../../css/AdminInfomation.css";
import axios from "axios";
import config from "../../../config";
import {
  CForm,
  CFormInput,
  CInputGroup,
  CButton,
  CFormCheck,
  CFormTextarea,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CImage,
} from "@coreui/react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Spin, message, notification } from "antd";

function EditAdmin() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(2);
  const [permissions, setPermissions] = useState([]);
  const [permissionsTotal, setPermissionsTotal] = useState([]);
  const [categoriesPermission, setCategoriesPermission] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkViewPermission, setCheckViewPermission] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState("");
  const [file, setFile] = useState([]);

  const [isCollapse, setIsCollapse] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };
  const admin = useParams();

  useEffect(() => {
    const fetchAdminInformation = async () => {
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
          config.host + "/admin/infomation/" + admin.adminId + "/edit",
          {
            headers: headers,
          }
        );
        const data = res.data;
        if (data.status === true) {
          setUsername(data.userAdminDetail?.username);
          setFullName(data.userAdminDetail.display_name);
          setPassword(data.userAdminDetail?.password);
          setEmail(data.userAdminDetail.email);
          setPhone(data.userAdminDetail.phone);
          setPermissions(data.permissions);
          setCategoriesPermission(data.categorys);
          setIsLoading(false);
          setSelectedFile(data?.userAdminDetail.picture);
        }

        if (res.data.mess == "no permission") {
          setCheckViewPermission(true);
        }
      } catch (error) {
        console.error("fetch data error", error);
      }
    };
    fetchAdminInformation();
  }, [admin.adminId]);

  useEffect(() => {
    const fetchAdminInformation = async () => {
      try {
        let headers = {
          "Content-Type": "application/json",
        };
        const token = localStorage.getItem("adminvtnk");

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await axios.get(`${config.host}/admin/get-permission`, {
          headers: headers,
        });
        const data = res.data;

        setPermissionsTotal(data);
      } catch (error) {
        console.error("fetch data error", error);
      }
    };
    fetchAdminInformation();
  }, []);

  const getTitle = (name) => {
    return name.split(".");
  };

  //set img category
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

  const handleSubmit = async () => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.put(
        config.host + "/admin/infomation/" + admin.adminId,
        {
          password: password,
          email: email,
          phone: phone,
          name: username,
          permissionId: permissions,
          categoryId: categoriesPermission,
          display_name: fullName,
          picture: selectedFile,
        },
        {
          headers: headers,
        }
      );

      if (res.status === 200) {
        message.info("Cập nhật thông tin thành công!");
      } else if ((res.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

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
        <CContainer className="container">
          <CRow className="mb-3">
            <CCol md={6}>
              <h3>QUẢN LÝ TÀI KHOẢN ADMIN</h3>
              <h6>Chỉnh sửa tài khoản Admin</h6>
            </CCol>

            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <Link to={`/admin`}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CForm>
                <CFormInput
                  type="text"
                  id="name"
                  label="Tên đăng nhập"
                  placeholder=""
                  aria-describedby="exampleFormControlInputHelpInline"
                  text="Tên đăng nhập hệ thống (bắt buộc)."
                  value={username}
                  readOnly
                />
                <br />
                <CFormInput
                  type="password"
                  id="name1"
                  label="Mật khẩu"
                  placeholder=""
                  aria-describedby="exampleFormControlInputHelpInline"
                  text="mật khẩu (không được để trống)."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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

                  <div>
                    {file.length == 0 ? (
                      <div>
                        <CImage
                          className="border"
                          src={
                            `http://192.168.245.180:8000/upload/` + selectedFile
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

                <CFormInput
                  type="email"
                  id="name2"
                  label="Thư điện tử"
                  placeholder=""
                  aria-describedby="exampleFormControlInputHelpInline"
                  text="Thư điện tử (bắt buộc)."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <CFormInput
                  type="number"
                  id="phone"
                  label="Số điện thoại"
                  placeholder=""
                  aria-describedby="exampleFormControlInputHelpInline"
                  text="Số điện thoại (bắt buộc)."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <br />
                <CFormInput
                  type="text"
                  id="name4"
                  label="Tên hiển thị"
                  placeholder=""
                  aria-describedby="exampleFormControlInputHelpInline"
                  text="Tên hiển thị (bắt buộc)."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <br />

                <table className="filter-table" style={{ userSelect: "none" }}>
                  <thead>
                    <tr>
                      <th colSpan="2">
                        <div className="d-flex justify-content-between">
                          <span>QUYỀN TRUY CẬP</span>
                          <span
                            className="toggle-pointer"
                            onClick={handleToggleCollapse}
                          >
                            {isCollapse ? "▼" : "▲"}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {!isCollapse && (
                    <tbody>
                      {/* quan ly admin */}
                      <tr>
                        <td>
                          <CFormCheck
                            id="adminCheckbox"
                            label={"Quản lí tài khoản admin"}
                            checked={categoriesPermission?.includes(1)}
                            onChange={(e) => {
                              const idx = 1;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                setCategoriesPermission([
                                  ...categoriesPermission,
                                  idx,
                                ]);
                              } else {
                                setCategoriesPermission(
                                  categoriesPermission.filter(
                                    (item) => item !== idx
                                  )
                                );
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {permissionsTotal.admin?.map((item) => (
                              <div key={item.id}>
                                <div key={item.name}>
                                  <CFormCheck
                                    id={`flexCheckDefault_${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions?.includes(item.id)}
                                    onChange={(e) => {
                                      const idDe = item.id;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        setPermissions([...permissions, idDe]);
                                      } else {
                                        setPermissions(
                                          permissions.filter(
                                            (id) => id !== idDe
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      {/* quan ly hoc sinh */}
                      <tr>
                        <td>
                          <CFormCheck
                            id="studentCheckbox"
                            label={"Quản lí sinh viên"}
                            checked={categoriesPermission?.includes(2)}
                            onChange={(e) => {
                              const idx = 2;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                setCategoriesPermission([
                                  ...categoriesPermission,
                                  idx,
                                ]);
                              } else {
                                setCategoriesPermission(
                                  categoriesPermission.filter(
                                    (item) => item !== idx
                                  )
                                );
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {permissionsTotal?.student?.map((item) => (
                              <div key={item.id}>
                                <div key={item.name}>
                                  <CFormCheck
                                    id={`flexCheckDefault_${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions?.includes(item.id)}
                                    onChange={(e) => {
                                      const idDe = item.id;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        setPermissions([...permissions, idDe]);
                                      } else {
                                        setPermissions(
                                          permissions.filter(
                                            (id) => id !== idDe
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      {/* quan ly manh thuong quan */}
                      <tr>
                        <td>
                          <CFormCheck
                            id="memberCheckbox"
                            label={"Quản lí mạnh thường quân"}
                            checked={categoriesPermission?.includes(3)}
                            onChange={(e) => {
                              const idx = 3;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                setCategoriesPermission([
                                  ...categoriesPermission,
                                  idx,
                                ]);
                              } else {
                                setCategoriesPermission(
                                  categoriesPermission.filter(
                                    (item) => item !== idx
                                  )
                                );
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {permissionsTotal.member?.map((item) => (
                              <div key={item.id}>
                                <div key={item.name}>
                                  <CFormCheck
                                    id={`flexCheckDefault_${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions?.includes(item.id)}
                                    onChange={(e) => {
                                      const idDe = item.id;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        setPermissions([...permissions, idDe]);
                                      } else {
                                        setPermissions(
                                          permissions.filter(
                                            (id) => id !== idDe
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      {/* quan ly tin tuc */}
                      <tr>
                        <td>
                          <CFormCheck
                            className="col-3"
                            id="newsCheckbox"
                            label={"Quản lí tin tức"}
                            checked={categoriesPermission?.includes(4)}
                            onChange={(e) => {
                              const idx = 4;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                setCategoriesPermission([
                                  ...categoriesPermission,
                                  idx,
                                ]);
                              } else {
                                setCategoriesPermission(
                                  categoriesPermission.filter(
                                    (item) => item !== idx
                                  )
                                );
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {permissionsTotal.news?.map((item) => (
                              <div key={item.id}>
                                <div key={item.name}>
                                  <CFormCheck
                                    id={`flexCheckDefault_${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions?.includes(item.id)}
                                    onChange={(e) => {
                                      const idDe = item.id;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        setPermissions([...permissions, idDe]);
                                      } else {
                                        setPermissions(
                                          permissions.filter(
                                            (id) => id !== idDe
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      {/* quan ly bai dang */}
                      <tr>
                        <td>
                          <CFormCheck
                            id="postCheckbox"
                            label={"Quản lí bài đăng"}
                            checked={categoriesPermission?.includes(5)}
                            onChange={(e) => {
                              const idx = 5;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                setCategoriesPermission([
                                  ...categoriesPermission,
                                  idx,
                                ]);
                              } else {
                                setCategoriesPermission(
                                  categoriesPermission.filter(
                                    (item) => item !== idx
                                  )
                                );
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {permissionsTotal.post?.map((item) => (
                              <div key={item.id}>
                                <div key={item.name}>
                                  <CFormCheck
                                    id={`flexCheckDefault_${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions?.includes(item.id)}
                                    onChange={(e) => {
                                      const idDe = item.id;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        setPermissions([...permissions, idDe]);
                                      } else {
                                        setPermissions(
                                          permissions.filter(
                                            (id) => id !== idDe
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      {/* quan ly banner */}
                      <tr>
                        <td>
                          <CFormCheck
                            id="postCheckbox"
                            label={"Quản lí banner"}
                            checked={categoriesPermission?.includes(6)}
                            onChange={(e) => {
                              const idx = 6;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                setCategoriesPermission([
                                  ...categoriesPermission,
                                  idx,
                                ]);
                              } else {
                                setCategoriesPermission(
                                  categoriesPermission.filter(
                                    (item) => item !== idx
                                  )
                                );
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {permissionsTotal.banner?.map((item) => (
                              <div key={item.id}>
                                <div key={item.name}>
                                  <CFormCheck
                                    id={`flexCheckDefault_${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions?.includes(item.id)}
                                    onChange={(e) => {
                                      const idDe = item.id;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        setPermissions([...permissions, idDe]);
                                      } else {
                                        setPermissions(
                                          permissions.filter(
                                            (id) => id !== idDe
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
                <br />

                <CButton
                  onClick={handleSubmit}
                  type="button"
                  color="primary"
                  size="sm"
                >
                  Cập nhật
                </CButton>
              </CForm>
            </CCol>
          </CRow>
        </CContainer>
      )}
    </>
  );
}

export default EditAdmin;
