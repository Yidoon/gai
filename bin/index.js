#!/usr/bin/env node
const parseArgs = require("minimist")(process.argv.slice(2));
const gitlab = require("./gitlab");
const http = require("http");
const {
  getLocalProjectName,
  getCurrentBranch,
  getLatestCommitMessage,
  getOrigin,
} = require("./git");
const openai = require("./openai");
const path = require("path");
const chalk = require("chalk");
const { open, getUrlFromOrigin } = require("./utils");

const args = process.argv.slice(2);

const initCreateMr = async () => {
  const targetBranch = args[1];
  let title = args[2];
  const p = process.cwd();
  const projectName = await getLocalProjectName(p);
  const gitlabProjects = await gitlab.getProject(projectName);
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
  try {
    const webUrl = await gitlab.createMr(payload).catch((errorRes) => {});
    console.log(chalk.green(`Create mr success: ${webUrl}`));
    webUrl && open(webUrl);
  } catch (errorRes) {
    console.log(
      chalk.red(
        `create mr Error: status ${errorRes.response.status}, statsText: ${errorRes.response.statusText}`
      )
    );
  }
};
const genBranchname = async () => {
  const DefaultFormat = "feat/xxxx-xxx-xxx-dyd";
  const _format = parseArgs.format || DefaultFormat;
  const prompt = `Please give me a branch name, the description is: ${parseArgs.b}, the format is: ${_format}, no more than 30 characters`;
  const res = await openai.createChatCompletion({ prompt: prompt });
};
const openOrigin = async () => {
  const origin = await getOrigin();
  const url = await getUrlFromOrigin(origin);
  console.log(url);
  url && open(url);
};
if (args[0] === "mr") {
  initCreateMr();
}
if (args[0] === "open") {
  openOrigin();
}
if (parseArgs.b) {
  genBranchname();
}
