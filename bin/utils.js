const { exec } = require("child_process");

const open = (url) => {
  exec(`open ${url}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
};

const getUrlFromOrigin = (origin) => {
  const gitProtocol = origin.split("://")[0];
  let url = "";
  // ssh://[user@]host.xz[:port]/path/to/repo.git -> [user@]host.xz[:port]/path/to/repo.git
  // http[s]://host.xz[:port]/path/to/repo.git -> host.xz[:port]/path/to/repo.git
  let uri = origin.indexOf("://") ? origin.split("://")[1] : origin;
  if (gitProtocol === "ssh") {
    // [user@]host.xz[:port]/path/to/repo.git -> [user@]host.xz[:port]/path/to/repo
    uri = uri.replace(".git", "");
    // [user@]host.xz[:port]/path/to/repo.git -> host.xz[:port]/path/to/repo.git
    uri = uri.replace("git@", "");

    // host.xz[:port]/path/to/repo -> host.xz
    const host = uri.split(":")[0];
    // host.xz[:port]/path/to/repo -> /path/to/repo
    const path = uri.split(":")[1].split("/").slice(1).join("/");
    // http://host.xz/path/to/repo
    url = `http://${host}/${path}`;
  }
  if (gitProtocol === "https") {
    // https://host.xz[:port]/path/to/repo.git -> https://host.xz[:port]/path/to/repo
    url = origin.replace(".git", "");
  }
  // git@host.xz:user/path/to/repo.git
  if (!["https", "ssh"].includes(gitProtocol)) {
    // git@host.xz:user/path/to/repo.git -> host.xz:user/path/to/repo.git
    uri = origin.split("@")[1];
    // host.xz:user/path/to/repo.git -> host.xz
    const host = uri.split(":")[0];
    // host.xz:user/path/to/repo.git -> user
    const user = uri.split(":")[1].split("/")[0];
    // host.xz:user/path/to/repo.git -> user/path/to/repo.git
    const path = uri
      .split(":")[1]
      .split("/")
      .slice(1)
      .join("/")
      .replace(".git", "");
    url = `http://${host}/${user}/${path}`;
  }
  return url;
};
module.exports = {
  open,
  getUrlFromOrigin,
};
