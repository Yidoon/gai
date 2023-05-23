import AuthorSelect from "@/components/AuthorSelect";
import BranchSourceSelect from "@/components/BranchSourceSelect";
import { Branch, BranchSourceListItem } from "@/types/git";
import { copyToClipboard } from "@/utils";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
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
  const [branchSource, setBranchSource] = useState<BranchSourceListItem[]>([]);

  const [form] = Form.useForm();

  const reqBranchSource = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/remote`
    );
    const sources = Object.keys(res.data.data).map((key) => {
      return {
        isRemote: true,
        name: key,
      };
    });
    setBranchSource(
      sources.concat([
        { isRemote: false, name: "all" },
        { isRemote: false, name: "local" },
      ])
    );
  };
  const reqBranchs = async (params?: any) => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/branch`,
      {
        params: {
          ...params,
        },
      }
    );
    setLoading(false);
    setBranchs(res.data.data);
  };
  const handleBranchDelete = async (branchs: React.Key[]) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/api/branch`, {
      data: {
        branchs: selectedRowKeys,
      },
    });
    message.success("Success");
    reqBranchs({ branchSource: "local" });
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
        const _branchNames = branchSource.map((item) => item.name);
        const prefixText =
          _branchNames.indexOf(originName) > -1 ? originName : "local";
        const color =
          _branchNames.indexOf(originName) > -1 ? "volcano" : "geekblue";
        return (
          <div>
            <Tag color={color}>{prefixText}</Tag>
            <span>{val}</span>
          </div>
        );
      },
    },
    {
      title: "Latest commit date(Human readable)",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Latest commit subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Latest commit hash",
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
      title: "Latest commit time",
      dataIndex: "time",
      key: "time",
      render: (value: number) => {
        return dayjs.unix(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Latest commit author",
      dataIndex: "author",
      key: "author",
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
    return (
      <Space size={16}>
        <div>
          一共 <span style={{ color: "#166cff" }}>{branchs.length}</span> 个分支
        </div>
        <div>
          {selectedRowKeys.length > 0 ? (
            <div>
              已选{" "}
              <span style={{ color: "#166cff" }}>{selectedRowKeys.length}</span>
              个分支
            </div>
          ) : (
            "No branch selected"
          )}
        </div>
      </Space>
    );
  };
  const handleSearch = () => {
    const values = form.getFieldsValue();
    reqBranchs(values);
  };

  useEffect(() => {
    reqBranchs();
    reqBranchSource();
  }, []);

  return (
    <div className="p-4">
      <div className="flex mb-4 justify-between">
        <Form form={form} layout="inline">
          <Form.Item name="author" label="Author">
            <AuthorSelect />
          </Form.Item>
          <Form.Item name="branchSource" label="Source">
            <BranchSourceSelect
              dataSource={branchSource}
              disableRequest={false}
            />
          </Form.Item>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>
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
