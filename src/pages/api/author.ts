import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

const getAllAuthors = (path: string) => {
  return new Promise((resolve, reject) => {
    const command = `git log --format='%aN' | sort -u`;
    // git log --format='%aN' | sort -u
    try {
      exec(command, { cwd: path }, (err, stdout, stderr) => {
        const authors = stdout.split("\n").filter(Boolean);
        resolve(authors);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export default async function author(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { path } = req.query as { path: string };
    const authors = await getAllAuthors(process.env.MOCK_PROJECT_PATH!);
    res.json({
      data: authors,
      msg: "",
      code: 0,
    });
  }
}
