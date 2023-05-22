import AuthorSelect from "@/components/AuthorSelect";
import BranchSourceSelect from "@/components/BranchSourceSelect";
import { Branch } from "@/types/git";
import { copyToClipboard } from "@/utils";
import { CopyOutlined } from "@ant-design/icons";
import { Button, Form, Popconfirm, Space, Table, Tag, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { config } from "dotenv";
import _ from "lodash";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [branchs, setBranchs] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const reqBranchs = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/branch`
    );
    setLoading(false);
    setBranchs(res.data.data);
  };
  const handleBranchDelete = async (branchs: React.Key[]) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/branch`,
      {
        data: {
          branchs: selectedRowKeys,
        },
      }
    );
    reqBranchs();
  };
  const handleSelectSuggestionBranch = async () => {
    const suggestBranchs = _.filter(branchs, (branch) => {
      return branch.time < dayjs().subtract(5, "month").unix();
    });
    const selectedBranchs = _.map(suggestBranchs, "branch");
    setSelectedRowKeys(selectedBranchs);
  };

  const columns = [
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      render: (val: string) => {
        const originName = val.split("/")[0];
        return (
          <div>
            <Tag color="#2db7f5">{originName}</Tag>
            <span>{val}</span>
          </div>
        );
      },
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
      render: (val: string) => {
        return (
          <Space>
            <span>{val.slice(0, 7)}</span>
            {/* @ts-ignore */}
            <CopyOutlined
              className="cursor-pointer"
              onClick={() => {
                copyToClipboard(val);
                message.success("复制成功");
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (value: number) => {
        return dayjs.unix(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Action",
      dataIndex: "branch",
      key: "action",
      render: (val: string) => {
        return (
          <Popconfirm
            title="Delete the branch"
            description="Are you sure to delete this branchs?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              handleBranchDelete([val]);
            }}
          >
            <Button type="link"> 删除 </Button>
          </Popconfirm>
        );
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Branch[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };
  const renderTableFooter = () => {
    return selectedRowKeys.length > 0 ? (
      <div>
        已选 <span style={{ color: "#166cff" }}>{selectedRowKeys.length}</span>{" "}
        个分支
      </div>
    ) : (
      "暂未选择分支"
    );
  };
  useEffect(() => {
    reqBranchs();
  }, []);

  return (
    <div className="p-4">
      <div className="flex mb-4 justify-between">
        <Form form={form} layout="inline">
          <Form.Item name="author" label="Author">
            <AuthorSelect />
          </Form.Item>
          <Form.Item name="source" label="Source">
            <BranchSourceSelect />
          </Form.Item>
        </Form>
        <div>
          <Space size={12}>
            <Popconfirm
              title="Delete the branchs"
              description="Are you sure to delete this branchs?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                handleBranchDelete(selectedRowKeys);
              }}
            >
              <Button disabled={selectedRowKeys.length === 0}>
                批量删除选中项
              </Button>
            </Popconfirm>
            <Button type="primary" onClick={handleSelectSuggestionBranch}>
              一键选中久远分支
            </Button>
          </Space>
        </div>
      </div>
      <Table
        dataSource={branchs}
        columns={columns}
        rowKey="branch"
        loading={loading}
        footer={renderTableFooter}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </div>
  );
}
