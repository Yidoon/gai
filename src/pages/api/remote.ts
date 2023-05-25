import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { exec } from "child_process";

interface Remote {
  [key: string]: string;
}
export const getRemote = (path: string) => {
  return new Promise((resolve, reject) => {
    exec("git remote -v", { cwd: path }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        const remote: Remote = {};
        const remotes = stdout.trim().split("\n");
        remotes.forEach((r) => {
          const [name, url] = r.trim().split(/\s+/);
          if (!remote[name]) {
            remote[name] = url;
          }
        });
        resolve(remote);
      }
    });
  });
};

export default async function remote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { path } = req.query as { path: string };
    const data = await getRemote(process.env.MOCK_PROJECT_PATH!);
    res.json({
      data: data,
      msg: "",
      code: 0,
    });
  }
}
