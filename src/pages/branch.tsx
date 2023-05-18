import React, { useEffect } from "react";

export default function Branch() {
  const initBranchList = async () => {
    const res = await fetch("http://localhost:3000/api/branch");
    const data = await res.json();
    console.log(data, "dddd");
  };

  useEffect(() => {
    initBranchList();
  }, []);
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
