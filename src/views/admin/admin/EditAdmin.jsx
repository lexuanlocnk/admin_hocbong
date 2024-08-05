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
        <div className="container">
          <div className="row">
            <h3>QUẢN LÝ TÀI KHOẢN ADMIN</h3>
            <div className="col-md">
              <h5>Thông tin Admin</h5>
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

                <div className="container" style={{ userSelect: "none" }}>
                  <h5>Quyền truy cập</h5>
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="adminCheckbox"
                      label={"Quản lí Admin"}
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
                            categoriesPermission.filter((item) => item !== idx)
                          );
                        }
                      }}
                    />
                    <div className="col-9 d-flex">
                      {permissionsTotal.admin?.map((item, index) => (
                        <div key={item.id} className="container">
                          <div key={item.name} style={{ marginRight: "30px" }}>
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
                                    permissions.filter((id) => id !== idDe)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
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
                            categoriesPermission.filter((item) => item !== idx)
                          );
                        }
                      }}
                    />
                    <div className="col-9 d-flex">
                      {permissionsTotal?.student?.map((item) => (
                        <div key={item.id} className="container">
                          <div key={item.name} style={{ marginRight: "30px" }}>
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
                                    permissions.filter((id) => id !== idDe)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
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
                            categoriesPermission.filter((item) => item !== idx)
                          );
                        }
                      }}
                    />
                    <div className="col-9 d-flex">
                      {permissionsTotal.member?.map((item) => (
                        <div key={item.id} className="container">
                          <div key={item.name} style={{ marginRight: "30px" }}>
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
                                    permissions.filter((id) => id !== idDe)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
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
                            categoriesPermission.filter((item) => item !== idx)
                          );
                        }
                      }}
                    />
                    <div className="col-9 d-flex">
                      {permissionsTotal.news?.map((item) => (
                        <div key={item.id} className="container">
                          <div key={item.name} style={{ marginRight: "30px" }}>
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
                                    permissions.filter((id) => id !== idDe)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
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
                            categoriesPermission.filter((item) => item !== idx)
                          );
                        }
                      }}
                    />
                    <div className="col-9 d-flex">
                      {permissionsTotal.post?.map((item) => (
                        <div key={item.id} className="container">
                          <div key={item.name} style={{ marginRight: "30px" }}>
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
                                    permissions.filter((id) => id !== idDe)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
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
                            categoriesPermission.filter((item) => item !== idx)
                          );
                        }
                      }}
                    />
                    <div className="col-9 d-flex">
                      {permissionsTotal.banner?.map((item) => (
                        <div key={item.id} className="container">
                          <div key={item.name} style={{ marginRight: "30px" }}>
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
                                    permissions.filter((id) => id !== idDe)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <br />

                <CButton
                  onClick={handleSubmit}
                  type="button"
                  color="primary"
                  variant="outline"
                >
                  Cập nhật
                </CButton>
              </CForm>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditAdmin;
