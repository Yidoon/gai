import { BranchSourceListItem } from "@/types/git";
import { Select, SelectProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Option } = Select;

interface Props extends SelectProps {
  dataSource?: BranchSourceListItem[];
  disableRequest?: boolean;
}
const BranchSourceSelect = (props: Props) => {
  const { dataSource, disableRequest, ...restProps } = props;
  const [branchSource, setBranchSource] = useState<BranchSourceListItem[]>([]);
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

  useEffect(() => {
    if (dataSource && disableRequest) {
      setBranchSource(dataSource);
    } else {
      reqBranchSource();
    }
  }, [disableRequest, dataSource]);

  const Options = branchSource.map((source, index) => {
    return (
      <Option key={index} value={source.name}>
        {source.isRemote ? `remote/${source.name}` : source.name}
      </Option>
    );
  });
  return (
    <Select {...restProps} style={{ width: 240 }}>
      {Options}
    </Select>
  );
};

export default BranchSourceSelect;
