#!/usr/bin/env node
const parseArgs = require("minimist")(process.argv.slice(2));
const { getProject, createMr } = require("./gitlab");
const http = require("http");
const {
  getLocalProjectName,
  getCurrentBranch,
  getLatestCommitMessage,
} = require("./git");
const openai = require("./openai");
const path = require("path");
const chalk = require("chalk");

const args = process.argv.slice(2);

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
const genBranchname = async () => {
  const DefaultFormat = "feat/xxxx-xxx-xxx-dyd";
  const _format = parseArgs.format || DefaultFormat;
  const prompt = `Please give me a branch name, the description is: ${parseArgs.b}, the format is: ${_format}, no more than 30 characters`;
  const res = await openai.createChatCompletion({ prompt: prompt });
};
if (args[0] === "mr") {
  initCreateMr();
}
if (parseArgs.b) {
  genBranchname();
}
