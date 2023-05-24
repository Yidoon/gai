import { BRANCH_SOURCE } from "@/constant";
import { Select, SelectProps } from "antd";

const { Option } = Select;

interface Props extends SelectProps {}
const BranchSourceSelect = (props: Props) => {
  const Options = BRANCH_SOURCE.map((source, index) => {
    return (
      <Option key={index} value={source}>
        {source}
      </Option>
    );
  });
  return (
    <Select {...props} style={{ width: 240 }}>
      {Options}
    </Select>
  );
};

export default BranchSourceSelect;
