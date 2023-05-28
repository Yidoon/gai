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

module.exports = {
  open,
};
