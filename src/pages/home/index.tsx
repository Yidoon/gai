import { Branch } from "@/types/git";
import { Button, Popconfirm, Table } from "antd";
import axios from "axios";
import { config } from "dotenv";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [branchs, setBranchs] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const reqBranchs = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/branch`
    );
    setLoading(false);
    setBranchs(res.data.data);
  };
  const handleBranchDelete = async () => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/branch`,
      {
        data: {
          branchs: selectedRowKeys,
        },
      }
    );
    console.log("affectedRows", res.data.data);
    reqBranchs();
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
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Branch[]) => {
      console.log(selectedRowKeys, "selectedRowKeys");
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  useEffect(() => {
    reqBranchs();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <Popconfirm
          title="Delete the branchs"
          description="Are you sure to delete this branchs?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleBranchDelete}
        >
          <Button disabled={selectedRowKeys.length === 0}>批量删除</Button>
        </Popconfirm>
      </div>
      <Table
        dataSource={branchs}
        columns={columns}
        rowKey="branch"
        loading={loading}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </div>
  );
}
