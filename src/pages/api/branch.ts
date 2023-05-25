import { exec } from "child_process";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { Branch, BranchSource } from "@/types/git";
import _ from "lodash";
import { getRemote } from "./remote";

const EXCLUDE_BRANCHS = ["master", "dev", "stage", "uat", "develop"];
export const LIST_LOCAL_BRANCHS = "git branch";
export const LIST_REMOTE_BRANCHS = "git branch -r";
export const LIST_ALL_BRANCHS = "git branch -a";
const SPLITE_CHARACTER = "_cgb_";
let CURRENT_BRANCH = "";
const MOCK_PROJECT_PATH = process.env.NEXT_PUBLIC_MOCK_PROJECT_PATH!;

const getCommandOfBranch = (branchSource: BranchSource) => {
  if (branchSource === "local") {
    return LIST_LOCAL_BRANCHS;
  }
  if (branchSource === "all") {
    return LIST_ALL_BRANCHS;
  }
  return LIST_REMOTE_BRANCHS;
};
/**
 * @param branch
 * @param path
 * @returns
 */
const getBranchLatestCommit = (branch: string, path?: string) => {
  const command = `git log ${branch} --oneline --date=relative --pretty=format:"%H${SPLITE_CHARACTER}%ad${SPLITE_CHARACTER}%s${SPLITE_CHARACTER}%ct${SPLITE_CHARACTER}%an" | head -n 1`;

  return new Promise((resolve, reject) => {
    exec(command, { cwd: path }, (err, stdout, stderr) => {
      const arr = stdout.split("_cgb_");
      try {
        const obj = {
          hash: arr?.[0]?.trim(),
          date: arr?.[1]?.split("\n")[0],
          time: Number(arr?.[3]?.split("\n")[0]),
          author: arr?.[4]?.split("\n")[0],
          branch: branch,
          subject: arr?.[2]?.trim(),
        };
        resolve(obj);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });
};

const getBranchs = (options: {
  branchSource: BranchSource;
  path: string;
}): Promise<string[]> => {
  const { branchSource, path } = options;
  const command = getCommandOfBranch(branchSource);

  return new Promise((resolve, reject) => {
    exec(command, { cwd: path }, (err, stdout, stderr) => {
      if (!err) {
        const list = stdout.split("\n").map((name: string) => {
          return name.replace("*", "").trim();
        });
        resolve(list);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
};
const getRemoteName = async (branch: string, projectPath: string) => {
  const tempPrefixArr = branch.split("/");
  const data = (await getRemote(projectPath)) as any;
  const remotes = Object.keys(data);
  for (let i = 0, len = tempPrefixArr.length; i < len; i++) {
    if (remotes.includes(tempPrefixArr[i])) {
      return tempPrefixArr[i];
    }
  }
  return "";
};
const getBranchData = async (options: {
  branchSource: BranchSource;
  path: string;
}) => {
  const { branchSource, path } = options;
  let originBranchs = await getBranchs({ branchSource, path });
  originBranchs.filter((name) => {
    if (name.indexOf("*") > -1) {
      CURRENT_BRANCH = name.replace("*", "").trim();
    }
    return name && !EXCLUDE_BRANCHS.includes(name) && name.indexOf("*") < 0;
  });
  const resultArr = [];
  let tempRes;
  for (let i = 0, len = originBranchs.length; i < len; i++) {
    if (originBranchs[i]) {
      let remoteName = await getRemoteName(originBranchs[i], path);
      tempRes = await getBranchLatestCommit(originBranchs[i], path);
      resultArr.push({ ...(tempRes || {}), remoteName: remoteName });
    }
  }
  return _.sortBy(resultArr, ["time"]);
};

const deleteBranch = (options: {
  path: string;
  branch: string;
  remoteName: string;
}) => {
  const { branch, path, remoteName } = options;
  const cmdStr = !remoteName
    ? `git branch -d ${branch}`
    : `git push ${remoteName} --delete ${branch.replace("origin/", "")}`;
  console.log(cmdStr, "cmdStr");
  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
      if (!err) {
        resolve(stdout);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
};

interface BranchParams {
  projectPath: string;
  branchSource: BranchSource;
  author: string;
  [key: string]: string;
}
export default async function branch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectPath, branchSource, author } = req.query as BranchParams;
  if (req.method === "GET") {
    let result = await getBranchData({
      branchSource,
      path: MOCK_PROJECT_PATH!,
    });
    if (author) {
      const authorArr = author.split(",");
      console.log(authorArr, "authorArr");
      result = result.filter((item: any) => {
        return authorArr.includes(item.author);
      });
    }
    res.json({
      data: result,
      msg: "",
      code: 0,
    });
  }
  if (req.method === "DELETE") {
    const { branchs } = req.body as {
      branchs: Array<{ branch: string; remoteName: string }>;
    };
    for (let i = 0, len = branchs.length; i < len; i++) {
      const { remoteName, branch } = branchs[i];
      try {
        await deleteBranch({
          branch: branch.trim(),
          path: MOCK_PROJECT_PATH,
          remoteName: remoteName,
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.json({
      data: branchs.length,
      msg: "",
      code: 0,
    });
  }
}
