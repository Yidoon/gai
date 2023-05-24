import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { exec } from "child_process";

interface Remote {
  [key: string]: {
    type?: string;
    url?: string;
    [key: string]: string | undefined;
  };
}
const getRemote = (path: string) => {
  return new Promise((resolve, reject) => {
    exec("git remote -v", { cwd: path }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        const remote: Remote = {};
        console.log(stdout, "stdout");
        const remotes = stdout.trim().split("\n");
        remotes.forEach((r) => {
          console.log(r, "r");
          const [name, url, type] = r.trim().split(/\s+/);
          if (!remote[name]) {
            remote[name] = {};
          }
          remote[name][type] = url;
        });
        resolve(remote);
      }
    });
  });
};

export default async function source(
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
