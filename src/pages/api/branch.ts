import { exec } from "child_process";
import path from "path";
import { NextApiRequest } from "next";
import { Branch, BranchType } from "@/types/git";

const EXCLUDE_BRANCHS = ["master", "dev", "stage", "uat", "develop"];
export const LIST_LOCAL_BRANCHS = "git branch";
export const LIST_REMOTE_BRANCHS = "git branch -r";
const SPLITE_CHARACTER = "_cgb_";
let CURRENT_BRANCH = "";

/**
 * @param branch
 * @param path
 * @returns
 */
const getBranchLatesCommit = (branch: string, path?: string) => {
  const cmdStr = `git log ${branch} --oneline --date=relative --pretty=format:"%h%${SPLITE_CHARACTER}%ad${SPLITE_CHARACTER}%s${SPLITE_CHARACTER}%ct" | head -n 1`;

  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
      const arr = stdout.split("_cgb_");
      try {
        const obj = {
          hash: arr?.[0]?.trim(),
          date: arr?.[1]?.split("\n")[0],
          date_unix: Number(arr?.[3]?.split("\n")[0]),
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

const getOriginBranchs = (
  type: BranchType,
  path: string
): Promise<string[]> => {
  const cmdStr = type === "local" ? LIST_LOCAL_BRANCHS : LIST_REMOTE_BRANCHS;
  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
      if (!err) {
        const list = stdout.split("\n").map((name: string) => {
          return name.trim();
        });
        resolve(list);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
};
const getBranchData = async (type: BranchType, path: string) => {
  let originBranchs = await getOriginBranchs(type, path);
  console.log(originBranchs.length, "originBranchs");
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
      tempRes = await getBranchLatesCommit(originBranchs[i], path);
      resultArr.push(tempRes);
    }
  }
  return resultArr;
};

export default async function branch(req: NextApiRequest, res: any) {
  if (req.method === "GET") {
    const { projectPath, type } = req.query as {
      projectPath: string;
      type: BranchType;
    };
    const mpDGclassPath = "/Users/Yidoon/Desktop/tenclass/mp-dgclass";

    const data = await getBranchData(type || "remote", mpDGclassPath);

    res.json({
      data: data,
      msg: "",
      code: 0,
    });
  }
}