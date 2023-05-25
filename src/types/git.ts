export interface Branch {
  branch: string;
  date: string;
  time: number;
  hash: string;
  subject: string;
  remoteName: string
}
export interface BranchSourceListItem {
  isRemote: boolean;
  name: string;
}
export type BranchSource = "local" | "remote" | "all";
