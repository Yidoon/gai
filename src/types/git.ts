export interface Branch {
  branch: string;
  date: string;
  dateUnix: string;
  hash: string;
  subject: string;
}
export type BranchType = "local" | "remote" | "all";
