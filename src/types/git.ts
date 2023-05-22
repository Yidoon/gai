export interface Branch {
  branch: string;
  date: string;
  time: number;
  hash: string;
  subject: string;
}
export type BranchType = "local" | "remote" | "all";
