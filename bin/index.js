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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const { open, getGitWebUrl } = require("./utils");
=======
const { open, getUrlFromOrigin } = require("./utils");
>>>>>>> f0ebd11 (chore)
=======
const { open, getGitWebUrl } = require("./utils");
>>>>>>> 047c850 (optimize open git web url)
=======
const { open, getGitWebUrl } = require("./utils");
>>>>>>> 1aaaf12 (optimize open git web url)
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const args = process.argv.slice(2);

const initCreateMr = async () => {
  if (!process.env.GITLAB_KEY) {
    console.log(chalk.red("Please set GITLAB_KEY in .env file"));
    return;
  }
  if (!process.env.GITLAB_HOST) {
    console.log(
      chalk.red(
        "Can't find gitlab host, please set GITLAB_HOST in .env file or it's not a valid gitlab project"
      )
    );
    return;
  }
  const targetBranch = args[1];
  let title = args[2];
  const p = process.cwd();
  const projectName = await getLocalProjectName(p);
  const gitlabProjects = await gitlab.getProject(projectName);
  const target = gitlabProjects.filter((item) => {
    return item.path === projectName;
  })[0];
  const { id } = target || {};
  if (id) {
    console.log(chalk.green(`Project: ${projectName} not found`));
    return;
  }
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
    console.log(chalk.red(`Create mr success: ${webUrl}`));
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
  console.log(chalk.green(`Suggest name: ${res}`));
};
const openGitWebUrl = async () => {
  const origin = await getOrigin();
  const url = await getGitWebUrl(origin);
  console.log(url);
  url && open(url);
};
if (args[0] === "mr") {
  initCreateMr();
}
if (args[0] === "open") {
  openGitWebUrl();
}
if (parseArgs.b) {
  genBranchname();
}
