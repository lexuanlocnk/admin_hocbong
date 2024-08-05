import { useEffect, useState } from "react";
import "../../../css/AdminInfomation.css";
import axios from "axios";
import config from "../../../config";
import { CForm, CFormInput, CButton, CFormCheck } from "@coreui/react";
import { message, notification } from "antd";

function AddAdmin() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [permissionsTotal, setPermissionsTotal] = useState([]);

  const [permissions, setPermissions] = useState([]);
  const [categoryPermissions, setCategoryPermissions] = useState([]);
  const permissionId = permissions.map((item) => item.id);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Thêm thông tin không thành công.",
      description: "Bạn không có quyền thực hiện tác vụ này.",
    });
  };
  const [newPermissions, setNewPermissions] = useState({
    childPermissions: [],
    categoryPermissions: [],
  });

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
        const res = await axios.get(
          "http://adminhocbong.vitinhnguyenkim.vn/api/admin/get-permission",
          {
            headers: headers,
          }
        );
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
        config.host + "/admin/infomation/",
        {
          password: password,
          email: email,
          phone: phone,
          username: username,
          permissionId: permissionId,
          categoryId: categoryPermissions,
          display_name: fullName,
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
      <div className="container">
        <div className="row">
          <h2>Quản trị tài khoản Admin</h2>
          <div className="col-md">
            <h5>Tạo tài khoản Admin</h5>
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

              <div>
                <h5>Quyền truy cập</h5>
                <div className="container">
                  {/* quan tri admin */}
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="flexCheckDefault"
                      label={"Quản trị Admin"}
                      checked={categoryPermissions?.includes(1)}
                      onChange={(e) => {
                        const idx = 1;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setCategoryPermissions([...categoryPermissions, idx]);
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
                  </div>

                  {/* quan tri hoc vien */}
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="flexCheckDefault"
                      label={"Quản trị học viên"}
                      checked={categoryPermissions?.includes(2)}
                      onChange={(e) => {
                        const idx = 2;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setCategoryPermissions([...categoryPermissions, idx]);
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
                  </div>

                  {/* quan tri manh thuong quan */}
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="flexCheckDefault"
                      label={"Quản trị mạnh thường quân"}
                      checked={categoryPermissions?.includes(3)}
                      onChange={(e) => {
                        const idx = 3;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setCategoryPermissions([...categoryPermissions, idx]);
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
                  </div>

                  {/* quan tri tin tuc */}
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="flexCheckDefault"
                      label={"Quản trị tin tức"}
                      checked={categoryPermissions?.includes(4)}
                      onChange={(e) => {
                        const idx = 4;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setCategoryPermissions([...categoryPermissions, idx]);
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
                  </div>

                  {/* quan tri homepage */}
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="flexCheckDefault"
                      label={"Quản trị trang chủ"}
                      checked={categoryPermissions?.includes(5)}
                      onChange={(e) => {
                        const idx = 5;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setCategoryPermissions([...categoryPermissions, idx]);
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
                  </div>

                  {/* quan tri banner */}
                  <div className="row mt-3">
                    <CFormCheck
                      className="col-3"
                      id="flexCheckDefault"
                      label={"Quản trị banner"}
                      checked={categoryPermissions?.includes(6)}
                      onChange={(e) => {
                        const idx = 6;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setCategoryPermissions([...categoryPermissions, idx]);
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
                  </div>
                </div>

                <CButton
                  className="mt-5"
                  onClick={handleSubmit}
                  type="button"
                  color="primary"
                  variant="outline"
                >
                  Thêm mới
                </CButton>
              </div>
            </CForm>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAdmin;
