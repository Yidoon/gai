import { Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Option } = Select;

interface Props {}
const AuthorSelect = (props: Props) => {
  const [authors, setAuthors] = useState<string[]>([]);
  const reqAuthors = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/author`
    );
    setAuthors(res.data.data);
  };

  useEffect(() => {
    reqAuthors();
  }, []);

  const Options = authors.map((author) => {
    return (
      <Option key={author} value={author}>
        {author}
      </Option>
    );
  });
  return (
    <Select {...props} mode="multiple" style={{ width: 360 }}>
      {Options}
    </Select>
  );
};

export default AuthorSelect;
