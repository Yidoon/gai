import { exec } from "child_process";
import path from "path";

const EXCLUDE_BRANCHS = ["master", "dev", "stage", "uat", "develop"];
export const LIST_LOCAL_BRANCHS = "git branch";
const SPLITE_CHARACTER = "_cgb_";
let CURRENT_BRANCH = "";

// 获取本地仓库的分支列表
const getBranchLatesCommit = (branch: string, path?: string) => {
  const cmdStr = `git log ${branch} --oneline --date=relative --pretty=format:"%h%${SPLITE_CHARACTER}%ad${SPLITE_CHARACTER}%s${SPLITE_CHARACTER}%ct" | head -n 1`;

  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
      const arr = stdout.split("_cgb_");
      console.log(arr, "arr");
      const obj = {
        hash: arr[0].trim(),
        date: arr[1].split("\n")[0],
        date_unix: Number(arr[3].split("\n")[0]),
        branch: branch,
        subject: arr[2].trim(),
      };
      if (!err) {
        resolve(obj);
      } else {
        reject(err);
      }
    });
  });
};
const generateBranchList = (path?: string) => {
  return new Promise((resolve, reject) => {
    exec(LIST_LOCAL_BRANCHS, { cwd: path }, async (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      let branchList = stdout.split("\n").map((name: string) => {
        return name.trim();
      });
      branchList = branchList.filter((name) => {
        if (name.indexOf("*") > -1) {
          CURRENT_BRANCH = name.replace("*", "").trim();
        }
        return name && !EXCLUDE_BRANCHS.includes(name) && name.indexOf("*") < 0;
      });
      const tempArr: any[] = [];
      let tempRes;
      for (let i = 0, len = branchList.length; i < len; i++) {
        if (branchList[i]) {
          tempRes = await getBranchLatesCommit(branchList[i], path);
          tempArr.push(tempRes);
        }
      }
      tempArr.sort((a, b) => a.date_unix - b.date_unix);
      resolve(tempArr);
    });
  });
};

export default async function name(req: Request, res: any) {
  if (req.method === "GET") {
    const projectPath = process.cwd();
    const mpDGclassPath = "/Users/Yidoon/Desktop/tenclass/mp-dgclass";
    console.log(projectPath, "projectPath");
    const branchList = await generateBranchList(mpDGclassPath);
    console.log(branchList, "branchList");
    res.json({
      data: branchList,
      msg: "",
      code: 0,
    });
  }
}
