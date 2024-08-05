import { useEffect, useState } from "react";
import { Card, Col, Row, Space, Spin } from "antd";
import SponsorsList from "./SponsorsList";
import StudentList from "./StudentList";
import "../../css/Dashboard.css";
import axios from "axios";
import config from "../../config";

const dashboardColors = {
  totalFund: "#e55353",
  totalScholarships: "#39f",
  amountGiven: "#f9b115",
  totalCommitment: "#5856d6",
  totalAmountRefunded: "#3B5998",
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [sponsorData, setSponsorData] = useState([]);
  const [currentSponsorsPage, setCurrentSponsorsPage] = useState(1);
  const [sponsorLoading, setSponsorLoading] = useState(false);

  const [studentData, setStudentData] = useState([]);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchTotalFund();
  }, []);

  const fetchTotalFund = async () => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("adminvtnk");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(config.host + "/admin/total-money", {
        headers: headers,
      });
      setDashboardData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Fail to fetch dashboard data: ", error);
    }
  };

  useEffect(() => {
    const fetchMemberTable = async () => {
      try {
        setSponsorLoading(true);
        let headers = {
          "Content-Type": "application/json",
        };
        const token = localStorage.getItem("adminvtnk");

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await axios.get(
          config.host + `/admin/show-member?page=${currentSponsorsPage}`,
          { headers: headers }
        );
        setSponsorData(res.data.data);
      } catch (error) {
        console.error("Fail to fetch SponsorList data: ", error);
      } finally {
        setSponsorLoading(false);
      }
    };

    fetchMemberTable();
  }, [currentSponsorsPage]);

  useEffect(() => {
    const fetchStudentTable = async () => {
      try {
        setStudentLoading(true);
        let headers = {
          "Content-Type": "application/json",
        };
        const token = localStorage.getItem("adminvtnk");

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await axios.get(
          config.host + `/admin/show-student?page=${currentStudentPage}`,
          { headers: headers }
        );
        setStudentData(res.data);
      } catch (error) {
        console.error("Fail to fetch StudentList data: ", error);
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudentTable();
  }, [currentStudentPage]);

  const currencyFormat = (num) => {
    return (
      Number(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " đ"
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="w-100 text-center">
          {" "}
          <Spin />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  title="Tổng quỹ hiện có"
                  bordered={false}
                  style={{
                    backgroundColor: dashboardColors.totalFund,
                    color: "white",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                >
                  {currencyFormat(dashboardData.totalFund)}
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title="Số học bổng"
                  bordered={false}
                  style={{
                    backgroundColor: dashboardColors.totalScholarships,
                    color: "white",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                >
                  {dashboardData.count}
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title="Số tiền đã trao"
                  bordered={false}
                  style={{
                    backgroundColor: dashboardColors.amountGiven,
                    color: "white",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                >
                  {currencyFormat(dashboardData.totalPaid)}
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  title="Tổng tiền cam kết góp"
                  bordered={false}
                  style={{
                    backgroundColor: dashboardColors.totalCommitment,
                    color: "white",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                >
                  {currencyFormat(dashboardData.commitmentMoney)}
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title="Tổng tiền đã hoàn trả"
                  bordered={false}
                  style={{
                    backgroundColor: dashboardColors.totalAmountRefunded,
                    color: "white",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                >
                  {currencyFormat(dashboardData.totalLeftPaid)}
                </Card>
              </Col>
            </Row>
          </div>

          <div>
            <h2>Danh sách mạnh thường quân đóng góp:</h2>
            <SponsorsList
              sponsorData={sponsorData}
              loading={sponsorLoading}
              currentPage={currentSponsorsPage}
              setCurrentPage={setCurrentSponsorsPage}
            />
          </div>

          <div>
            <h2>Danh sách sinh viên đăng ký vay:</h2>
            <StudentList
              studentData={studentData}
              loading={studentLoading}
              setCurrentPage={setCurrentStudentPage}
            />
          </div>
        </Space>
      )}
    </>
  );
}

export default Dashboard;
