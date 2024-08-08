import { Table, Tooltip } from "antd";
import Column from "antd/es/table/Column";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import dayjs from "dayjs";

function StudentList({ studentData, loading, setCurrentPage }) {
  // const [studentData, setStudentData] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [total, setTotal] = useState("");

  // useEffect(() => {
  //   fetchStudentTable(1);
  // }, []);

  // const fetchStudentTable = async (page) => {
  //   setLoading(true);
  //   try {
  //     let headers = {
  //       "Content-Type": "application/json",
  //     };
  //     const token = localStorage.getItem("adminvtnk");

  //     if (token) {
  //       headers.Authorization = `Bearer ${token}`;
  //     }
  //     const res = await axios.get(
  //       config.host + `/admin/show-student?page=${page}`,
  //       { headers: headers }
  //     );
  //     setStudentData(res.data.dataStudent.reverse());
  //     setTotal(res.data.count);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("fail to fetch data: ", error);
  //   }
  // };

  const currencyFormat = (num) => {
    return (
      Number(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " đ"
    );
  };

  const data =
    studentData?.dataStudent &&
    studentData?.dataStudent.length > 0 &&
    studentData?.dataStudent.map((item, index) => ({
      key: item.id,
      stt: index + 1,
      makh: item.signCode,
      name: item.nameMember,
      tel: item.phoneMember,
      reason_debt: item.reason,
      debt_amount: `${currencyFormat(item.loan)}`,
      refund_period: `${dayjs(item.deadline).format("DD/MM/YYYY")}`,
    }));

  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={{
        pageSize: 5,
        total: studentData.count,
        onChange: (page) => {
          setCurrentPage(page);
        },
      }}
    >
      <Column width={80} title="STT" dataIndex="stt" key="stt" />
      <Column title="Mã hợp đồng" dataIndex="makh" key="makh" />
      <Column title="Tên sinh viên" dataIndex="name" key="name" />
      <Column title="Số điện thoại" dataIndex="tel" key="tel" />
      {/* <Column
        title="Lý do nhận học bổng"
        dataIndex="reason_debt"
        key="reason_debt"
        ellipsis={true}
      /> */}
      <Column
        title="Tổng tiền nhận"
        dataIndex="debt_amount"
        key="debt_amount"
      />
      <Column
        title="Lần nhận gần nhất"
        dataIndex="refund_period"
        key="refund_period"
        render={(text) => <div>{text}</div>}
      />

      <Column
        title="Tác vụ"
        key="action"
        render={(record) => (
          <Link to={`/student/detail/${record.key}`}>Xem chi tiết</Link>
        )}
      />
    </Table>
  );
}

export default StudentList;
