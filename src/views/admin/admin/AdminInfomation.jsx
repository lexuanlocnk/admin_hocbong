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
} from "@coreui/react";
import { Spin, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";

function AddInfomation() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(2);
  const [permissions, setPermissions] = useState([]);
  const [permissionsTotal, setPermissionsTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isCollapse, setIsCollapse] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState);
  };

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

  const handleAddNewClick = () => {
    navigate("/admin/add");
  };

  return (
    <>
      {isLoading ? (
        <div className="w-100 text-center">
          <Spin />
        </div>
      ) : (
        <CContainer>
          <CRow className="mb-3">
            <CCol>
              <h3>THÔNG TIN ADMIN</h3>
              <h6>Thông tin tài khoản</h6>
            </CCol>
            <CCol md={{ span: 4, offset: 4 }}>
              <div className="d-flex justify-content-end">
                <CButton
                  onClick={handleAddNewClick}
                  color="primary"
                  type="submit"
                  size="sm"
                  className="button-add"
                >
                  Thêm mới
                </CButton>
                <Link to={`/admin`}>
                  <CButton
                    color="primary"
                    type="submit"
                    size="sm"
                    className="ms-2"
                  >
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow className="row">
            <CForm>
              <CFormInput
                type="text"
                id="name"
                label="Tên đăng nhập"
                placeholder=""
                aria-describedby="exampleFormControlInputHelpInline"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled
              />
              <br />
              <CFormInput
                type="email"
                id="name2"
                label="Thư điện tử"
                placeholder=""
                aria-describedby="exampleFormControlInputHelpInline"
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <br />

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
                      <tr>
                        <td>Quản lý tài khoản admin</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            {permissionsTotal.admin?.map((item) => (
                              <div>
                                <div
                                  key={item.name}
                                  style={{ marginRight: "30px" }}
                                >
                                  <CFormCheck
                                    id={`flexCheckDefault-${item.id}`}
                                    label={getTitle(item.name)[1]}
                                    checked={permissions.some(
                                      (itemx) => itemx.id === item.id
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td>Quản lý sinh viên</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            {permissionsTotal?.student?.map((item) => (
                              <div>
                                <div
                                  key={item.name}
                                  style={{ marginRight: "30px" }}
                                >
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
                        </td>
                      </tr>

                      <tr>
                        <td>Quản lý mạnh thường quân</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            {permissionsTotal.member?.map((item) => (
                              <div>
                                <div
                                  key={item.name}
                                  style={{ marginRight: "30px" }}
                                >
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
                        </td>
                      </tr>

                      <tr>
                        <td>Quản lý tin tức</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            {permissionsTotal.news?.map((item) => (
                              <div>
                                <div
                                  key={item.name}
                                  style={{ marginRight: "30px" }}
                                >
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
                        </td>
                      </tr>

                      <tr>
                        <td>Quản lý bài đăng</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            {permissionsTotal.post?.map((item) => (
                              <div>
                                <div
                                  key={item.name}
                                  style={{ marginRight: "30px" }}
                                >
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
                        </td>
                      </tr>

                      <tr>
                        <td>Quản lý banner</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            {permissionsTotal.banner?.map((item) => (
                              <div>
                                <div
                                  key={item.name}
                                  style={{ marginRight: "30px" }}
                                >
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
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
              <br />
            </CForm>
          </CRow>
        </CContainer>
      )}
    </>
  );
}

export default AddInfomation;
