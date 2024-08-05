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
import { Spin, notification } from "antd";

function AddInfomation() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(2);
  const [permissions, setPermissions] = useState([]);
  const [permissionsTotal, setPermissionsTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAdminInformation = async () => {
      try {
        let headers = {
          "Content-Type": "application/json",
        };
        const token = localStorage.getItem("adminvtnk");

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await axios.get(config.host + "/admin/admin-information", {
          headers: headers,
        });
        const data = res.data.data;
        setUsername(data.username);
        setFullName(data.display_name);
        setPassword(data.password);
        setEmail(data.email);
        setPhone(data.phone);
        setStatus(data.status);
        setPermissions(data.permissions);
        setIsLoading(false);
      } catch (error) {
        console.error("fetch data error", error);
      }
    };
    fetchAdminInformation();
  }, []);

  console.log(">>> check permissionsTotal", permissionsTotal);
  console.log(">>> check permissions", permissions);

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

  return (
    <>
      {isLoading ? (
        <div className="w-100 text-center">
          <Spin />{" "}
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <h2>Quản trị tài khoản Admin</h2>
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

                <div>
                  <h5>Quyền truy cập</h5>
                  <div className="row mt-3">
                    <div className="col-3">Quản lí Admin:</div>
                    <div className="col-9 d-flex">
                      {permissionsTotal.admin?.map((item, index) => (
                        <div>
                          <div key={item.name} style={{ marginRight: "30px" }}>
                            <CFormCheck
                              id="flexCheckDefault"
                              label={getTitle(item.name)[1]}
                              checked={permissions.some(
                                (itemx) => itemx.id === item.id
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-3">Quản lí sinh viên:</div>
                    <div className="col-9 d-flex">
                      {permissionsTotal?.student?.map((item) => (
                        <div>
                          <div key={item.name} style={{ marginRight: "30px" }}>
                            <CFormCheck
                              id="flexCheckDefault"
                              label={getTitle(item.name)[1]}
                              checked={permissions.some(
                                (itemx) => itemx.id === item.id
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-3">Quản lí mạnh thường quân:</div>
                    <div className="col-9 d-flex">
                      {permissionsTotal.member?.map((item) => (
                        <div>
                          <div key={item.name} style={{ marginRight: "30px" }}>
                            <CFormCheck
                              id="flexCheckDefault"
                              label={getTitle(item.name)[1]}
                              checked={permissions.some(
                                (itemx) => itemx.id === item.id
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-3">Quản lí tin tức:</div>
                    <div className="col-9 d-flex">
                      {permissionsTotal.news?.map((item) => (
                        <div>
                          <div key={item.name} style={{ marginRight: "30px" }}>
                            <CFormCheck
                              id="flexCheckDefault"
                              label={getTitle(item.name)[1]}
                              checked={permissions.some(
                                (itemx) => itemx.id === item.id
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-3">Quản lí bài đăng:</div>
                    <div className="col-9 d-flex">
                      {permissionsTotal.post?.map((item) => (
                        <div>
                          <div key={item.name} style={{ marginRight: "30px" }}>
                            <CFormCheck
                              id="flexCheckDefault"
                              label={getTitle(item.name)[1]}
                              checked={permissions.some(
                                (itemx) => itemx.id === item.id
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-3">Quản lí banner:</div>
                    <div className="col-9 d-flex">
                      {permissionsTotal.banner?.map((item) => (
                        <div>
                          <div key={item.name} style={{ marginRight: "30px" }}>
                            <CFormCheck
                              id="flexCheckDefault"
                              label={getTitle(item.name)[1]}
                              checked={permissions.some(
                                (itemx) => itemx.id === item.id
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <br />
              </CForm>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddInfomation;
