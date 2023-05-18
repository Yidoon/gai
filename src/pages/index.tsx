import React from "react";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];

export default function Index() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-orange-600">
        Hello world!
      </h1>
    </div>
  );
}
