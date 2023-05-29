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

/**
 * ssh://[user@]host.xz[:port]/path/to/repo.git/
 * git://host.xz[:port]/path/to/repo.git/
 * http[s]://host.xz[:port]/path/to/repo.git/
 * @param url
 * @returns
 */
const parseGitUrl = (url) => {
  const protocol =
    url.indexOf("://") > -1 ? url.split("://")[0] : url.split("@")[0];

  if (["https", "http"].includes(protocol)) {
    const host = url.split("://")[1].split("/")[0];
    const port = host.split(":")[1];
    const path = url.split("://")[1].split("/").slice(1).join("/");
    return {
      protocol,
      host,
      port,
      path,
      user: "",
    };
  }

  if (protocol === "ssh") {
    const host = url.split("://")[1].split("/")[0].split(":")[0].split("@")[1];
    const port = url.split("://")[1].split("/")[0].split(":")[1];
    const path = url.split("://")[1].split("/").slice(1).join("/");
    return {
      protocol,
      host,
      port,
      path,
      user: "",
    };
  }

  if (protocol === "git") {
    const host = url.split("@")[1].split(":")[0];
    const user = url.split("@")[1].split(":")[1].split("/")[0];
    const path = url.split("@")[1].split(":")[1].split("/").slice(1).join("/");
    return {
      protocol,
      host,
      port: "",
      path,
      user,
    };
  }
};
const getGitWebUrl = (url) => {
  const { protocol, host, path, user, port } = parseGitUrl(url);
  if (["https", "http"].includes(protocol)) {
    return `${protocol}://${host}/${path}`;
  }
  if (["ssh"].includes(protocol)) {
    const portStr = port ? `:${port}` : "";
    return `https://${host}/${path}`;
  }
  if (["git".includes(protocol)]) {
    return `https://${host}/${user}/${path}`;
  }
};

module.exports = {
  open,
  getGitWebUrl,
};
