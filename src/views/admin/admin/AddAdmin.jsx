import { useEffect, useState } from "react";
import "../../../css/AdminInfomation.css";
import axios from "axios";
import config from "../../../config";
import {
  CForm,
  CFormInput,
  CButton,
  CFormCheck,
  CContainer,
  CRow,
  CCol,
  CImage,
} from "@coreui/react";
import { message, notification } from "antd";
import { Link } from "react-router-dom";

function AddAdmin() {
  const [api, contextHolder] = notification.useNotification();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [permissionsTotal, setPermissionsTotal] = useState([]);

  const [permissions, setPermissions] = useState([]);
  const [categoryPermissions, setCategoryPermissions] = useState([]);
  const permissionId = permissions.map((item) => item.id);

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

  useEffect(() => {
    const fetchAdminPermissions = async () => {
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
    fetchAdminPermissions();
  }, []);

  const getTitle = (name) => {
    return name.split(".");
  };

  console.log(">>>> cehck data :", {
    permissions,
    categoryPermissions,
    permissionsTotal,
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

  const handleSubmit = async () => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.post(
        config.host + "/admin/infomation",
        {
          password: password,
          email: email,
          phone: phone,
          username: username,
          permissionId: permissionId,
          categoryId: categoryPermissions,
          display_name: fullName,
          picture: selectedFile,
        },
        {
          headers: headers,
        }
      );
      if (res.data.status === true) {
        message.info("Thêm thông tin thành công!");
      } else if (res.data.status === 202) {
        message.warning("Tên đăng nhập đã tồn tại trong database!");
      } else if ((res.data.mess = "no permission")) {
        openNotificationWithIcon("warning");
      } else {
        message.error("Thêm mới thất bại!");
      }
    } catch (error) {
      console.error("fetch data error", error);
    }
  };

  return (
    <>
      {contextHolder}
      <CContainer>
        <CRow className="mb-3">
          <CCol md={6}>
            <h3>QUẢN LÝ TÀI KHOẢN ADMIN</h3>
            <h6>Tạo tài khoản Admin</h6>
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
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <CFormInput
                type="password"
                id="name1"
                label="Mật khẩu"
                placeholder=""
                aria-describedby="exampleFormControlInputHelpInline"
                text="Mật khẩu (không được để trống)."
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
                        src={`${config.img}` + selectedFile}
                        width={300}
                      />
                    </div>
                  ) : (
                    file.map((item, index) => (
                      <CImage key={index} src={item} width={300} />
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
            </CForm>
          </CCol>
        </CRow>
        <CRow>
          <div>
            <table className="filter-table">
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
                  {/* quan tri admin */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý tài khoản admin"}
                        checked={categoryPermissions?.includes(1)}
                        onChange={(e) => {
                          const idx = 1;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 1
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(1) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.admin?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* quan tri hoc vien */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý sinh viên"}
                        checked={categoryPermissions?.includes(2)}
                        onChange={(e) => {
                          const idx = 2;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 2
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(2) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.student?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* quan tri manh thuong quan */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý mạnh thường quân"}
                        checked={categoryPermissions?.includes(3)}
                        onChange={(e) => {
                          const idx = 3;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 3
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(3) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.member?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* quan tri tin tuc */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý tin tức"}
                        checked={categoryPermissions?.includes(4)}
                        onChange={(e) => {
                          const idx = 4;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 4
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(4) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.news?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* quan tri homepage */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý trang chủ"}
                        checked={categoryPermissions?.includes(5)}
                        onChange={(e) => {
                          const idx = 5;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 5
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(5) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.post?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* quan tri banner */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý banner"}
                        checked={categoryPermissions?.includes(6)}
                        onChange={(e) => {
                          const idx = 6;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 6
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(6) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.banner?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* quan tri task */}
                  <tr>
                    <td>
                      <CFormCheck
                        id="flexCheckDefault"
                        label={"Quản lý nhiệm vụ"}
                        checked={categoryPermissions?.includes(7)}
                        onChange={(e) => {
                          const idx = 7;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setCategoryPermissions([
                              ...categoryPermissions,
                              idx,
                            ]);
                          } else {
                            const updatePermission = permissions.filter(
                              (item) => item.guard_name != 7
                            );

                            setPermissions(updatePermission);
                            setCategoryPermissions(
                              categoryPermissions.filter((id) => id !== idx)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      {categoryPermissions.includes(7) && (
                        <div className="col-9 d-flex">
                          {permissionsTotal.task?.map((item, index) => (
                            <div key={item.id}>
                              <div
                                key={item.name}
                                style={{ marginRight: "30px" }}
                              >
                                <CFormCheck
                                  id="flexCheckDefault"
                                  label={getTitle(item.name)[1]}
                                  checked={permissions.includes(item)}
                                  onChange={(e) => {
                                    const idDe = item.id;
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setPermissions([...permissions, item]);
                                    } else {
                                      setPermissions(
                                        permissions.filter(
                                          (item) => item.id !== idDe
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>

            <CButton
              className="mt-5"
              onClick={handleSubmit}
              type="button"
              color="primary"
              size="sm"
            >
              Thêm mới
            </CButton>
          </div>
        </CRow>
      </CContainer>
    </>
  );
}

export default AddAdmin;
