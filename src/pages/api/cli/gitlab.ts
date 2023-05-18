export default async function handler(req, res) {
  if (req.method === "POST") {
    // const { prompt } = req.query;
    const response = await fetch("https://gitlab.example.com/api/v4/projects", {
      headers: {
        "Private-Token": process.env.GITLAB_KEY,
      },
    });
    response.json().then((res) => {
      console.log(res, "ressss");
    });
  }
}
