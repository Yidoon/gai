#!/usr/bin/env node
const parseArgs = require("minimist")(process.argv.slice(2));
const aiBranchName = require("./ai_branch_name");
const { getProject, createMr } = require("./gitlab");
const http = require("http");
const {
  getLocalProjectName,
  getCurrentBranch,
  getLatestCommitMessage,
} = require("./git");
const path = require("path");
const chalk = require("chalk");

const args = process.argv.slice(2);

// gai -b "优化跳转" --format=feat/xxxx-xxx-xxx-dyd
// gai -b "优化跳转" -t feat
if (parseArgs.b) {
  // aiBranchName({
  //   desc: parseArgs.b,
  //   format: parseArgs.format,
  // }).then((res) => {
  //   console.log(res, "=====");
  // });
  const DefaultFormat = "feat/xxxx-xxx-xxx-dyd";
  const _format = parseArgs.format || DefaultFormat;
  const prompt = `Please give me a branch name, the description is: ${parseArgs.b}, the format is: ${_format}, no more than 30 characters`;
  console.log(prompt, "prompt");
  http.get(
    `http://localhost:3000/api/cli/branch_name?prompt=${prompt}`,
    (res) => {
      let list = [];
      res.on("data", (chunk) => {
        list.push(chunk);
      });
      res.on("end", () => {
        const res = Buffer.concat(list).toString();
        const { data } = JSON.parse(res);
        console.log(data, "data------");
      });
      res.on("error", (error) => {
        console.log(error);
      });
    }
  );
}

const initCreateMr = async () => {
  const targetBranch = args[1];
  let title = args[2];
  const p = process.cwd();
  const projectName = await getLocalProjectName(p);
  const gitlabProjects = await getProject(projectName);
  const target = gitlabProjects[0];
  const { id } = target;
  const branchName = await getCurrentBranch();
  if (!title) {
    title = await getLatestCommitMessage();
  }
  const payload = {
    id,
    source_branch: branchName,
    target_branch: targetBranch,
    title: title,
  };
  const webUrl = await createMr(payload);
  console.log(chalk.green(`create mr success: ${webUrl}`));
};
if (args[0] === "mr") {
  initCreateMr();
}
