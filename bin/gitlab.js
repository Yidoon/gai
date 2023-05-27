const axios = require("axios");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const getProject = async (projectName) => {
  const url = `${process.env.GITLAB_HOST}/api/v4/projects?private_token=${process.env.GITLAB_KEY}`;
  const res = await axios.get(url, {
    params: {
      search: projectName || "",
    },
    headers: {
      "Private-Token": process.env.GITLAB_KEY,
    },
  });
  return res.data;
};
const createMr = async (payload) => {
  const { id, source_branch, target_branch, title } = payload;
  const res = await axios.post(
    `${process.env.GITLAB_HOST}/api/v4/projects/${id}/merge_requests`,
    payload,
    {
      headers: {
        "Private-Token": process.env.GITLAB_KEY,
      },
    }
  );
  return res.data.web_url;
};

module.exports = {
  getProject,
  createMr,
};
