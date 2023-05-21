import { Button, Table } from "antd";
import axios from "axios";
import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [branchs, setBranchs] = useState([]);
  const [loading, setLoading] = useState(false);

  const reqBranchs = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/branch`
    );
    setLoading(false);
    setBranchs(res.data.data);
  };
  const columns = [
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Hash",
      dataIndex: "hash",
      key: "hash",
    },
    {
      title: "Action",
      dataIndex: "branch",
      key: "action",
      render: () => {
        return <Button type="link"> 删除 </Button>;
      },
    },
  ];

  useEffect(() => {
    reqBranchs();
  }, []);

  return (
    <div>
      <Table
        dataSource={branchs}
        columns={columns}
        rowKey="branch"
        loading={loading}
      />
    </div>
  );
}
