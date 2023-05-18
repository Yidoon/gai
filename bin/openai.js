const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async function (prompt) {
  if (!process.env.OPENAI_API_KEY) {
    return "";
  }
  console.log(process.env.OPENAI_API_KEY, "OPENAI_API_KEY");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const aiInstance = new OpenAIApi(configuration);
  const response = await aiInstance.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
  });
  console.log(response.data.choices[0].text, "response.data.choices[0].text");
  return response;
};
