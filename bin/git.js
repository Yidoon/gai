const { exec } = require("child_process");

/**
 * 获取本地 Git 仓库的远程仓库名
 * @param {string} path 本地 Git 仓库的路径
 */
function getLocalProjectName(path) {
  if (!path) {
    console.log("请输入 path");
    return "";
  }
  return new Promise((resolve, reject) => {
    exec(
      "git remote get-url origin",
      { cwd: path },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 Git 命令时发生错误: ${error.message}`);
          reject(null);
          return;
        }

        if (stderr) {
          console.error(`Git 命令输出错误: ${stderr}`);
          reject(null);
          return;
        }
        // 获取到远程仓库名
        const remoteName = stdout.trim();
        const reg = /.*\/(.*)\.git/;
        const match = remoteName.match(reg);
        resolve(match ? match[1] : null);
      }
    );
  });
}
function getCurrentBranch() {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --abbrev-ref HEAD", (err, stdout) => {
      if (err) reject(err);
      const branch = stdout.trim();
      resolve(branch);
    });
  });
}
function getLatestCommitMessage() {
  return new Promise((resolve, reject) => {
    exec("git log -1 --pretty=%B", (err, stdout) => {
      if (err) reject(err);
      const message = stdout.trim();
      resolve(message);
    });
  });
}
function getOrigin() {
  return new Promise((resolve, reject) => {
    exec("git remote get-url origin", (err, stdout) => {
      resolve(stdout.trim());
    });
  });
}

module.exports = {
  getLocalProjectName,
  getCurrentBranch,
  getLatestCommitMessage,
  getOrigin,
};
