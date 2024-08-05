import { Button, Checkbox, Form, Input, message } from "antd";

import "../../../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import config from "../../../config";
function Login() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        // "http://adminhocbong.vitinhnguyenkim.vn/api/admin-login",
        `${config.host}/admin-login`,
        {
          username,
          password,
        }
      );
      if (res.data.status == true) {
        localStorage.setItem("adminvtnk", res.data.token);
        localStorage.setItem("username", res.data.username);
        // window.location.reload()
        navigate("/");
      } else {
        if (res.data.mess == "username") {
          message.info("Sai tên đăng nhập");
        } else if (res.data.mess == "pass") {
          message.info("Sai mật khẩu");
        }
        message.info("Đăng nhập thất bại !!!");
      }
    } catch (error) {
      console.error("login error", error);
    }
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-form-left">
          <h1 className="login-title">Đăng nhập</h1>

          <div>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input onChange={(e) => setUserName(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button onClick={handleLogin} type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="login-form-right">
          <h1 className="login-title">Quỹ học bổng Nguyên Kim</h1>
          <div className="login-form-right-content">
            Quỹ học bổng Nguyễn Kim cung cấp học bổng cho sinh viên từ cấp độ
            đại học trở đi. Chương trình học bổng này nhằm đảm bảo rằng những
            sinh viên có tiềm năng và năng lực cao có cơ hội tiếp tục học tập và
            đạt được thành công trong học vấn. Học bổng không chỉ hỗ trợ tài
            chính mà còn mang lại những cơ hội học tập và phát triển cá nhân cho
            các sinh viên.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
