import { Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Option } = Select;

interface Props {}
const BranchSourceSelect = (props: Props) => {
  const [branchSource, setBranchSource] = useState<string[]>([]);
  const reqAuthors = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/remote`
    );
    const sources = Object.keys(res.data.data).map((key) => {
      return key;
    });
    setBranchSource(sources.concat("local", "all"));
  };

  useEffect(() => {
    reqAuthors();
  }, []);

  const Options = branchSource.map((source) => {
    return (
      <Option key={source} value={source}>
        {source}
      </Option>
    );
  });
  return (
    <Select {...props} style={{ width: 120 }}>
      {Options}
    </Select>
  );
};

export default BranchSourceSelect;
