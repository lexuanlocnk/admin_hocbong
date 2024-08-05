import { Table } from "antd";
import Column from "antd/es/table/Column";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";

function SponsorsList({ sponsorData, loading, currentPage, setCurrentPage }) {
  // const [sponsorData, setSponsorData] = useState([]);
  // const [total, setTotal] = useState("");
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchMemberTable(1);
  // }, []);

  // const fetchMemberTable = async (page) => {
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
  //       config.host + `/admin/show-member?page=${page}`,
  //       { headers: headers }
  //     );
  //     setSponsorData(res.data.data.data);
  //     setTotal(res.data.data.total);
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
    sponsorData?.data &&
    sponsorData?.data.length > 0 &&
    sponsorData?.data.map((item, index) => ({
      key: item.member_id,
      stt: index + 1,
      makh: item.mem_code,
      name: item.username,
      company_name: item.nameCompany,
      tel: item.phoneCompany,
      contributionAmount: `${currencyFormat(item.totalFundMoneyReal)}`,
      realContribution: `${currencyFormat(item.totalFundMoney)}`,
    }));

  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={{
        pageSize: sponsorData.per_page,
        total: sponsorData.total,
        onChange: (page) => {
          setCurrentPage(page);
        },
      }}
    >
      <Column width={80} title="STT" dataIndex="stt" key="stt" />
      {/* <Column title="Mã khách hàng" dataIndex="makh" key="makh" /> */}
      <Column title="Tên khách hàng" dataIndex="name" key="name" />
      <Column
        title="Tên công ty"
        dataIndex="company_name"
        key="company_name"
        ellipsis={true}
      />
      <Column title="Số điện thoại" dataIndex="tel" key="tel" />
      <Column
        title="Số tiền góp"
        dataIndex="contributionAmount"
        key="contributionAmount"
      />
      <Column
        title="Số cam kết"
        dataIndex="realContribution"
        key="realContribution"
      />
      {/* <Column title="Mã khách hàng" dataIndex="makh" key="makh" /> */}

      <Column
        title="Tác vụ"
        key="action"
        render={(record) => (
          <Link to={`/sponsor/detail/${record.key}`}>Xem chi tiết</Link>
        )}
      />
    </Table>
  );
}

export default SponsorsList;
