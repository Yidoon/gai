const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
dotenv.config();

class OpenAI {
  configuration;
  openaiInstance;
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.configuration = configuration;
    this.openaiInstance = new OpenAIApi(configuration);
  }
  async createChatCompletion(options) {
    const { prompt } = options;
    const completion = await this.openaiInstance.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return completion.data.choices[0].message.content;
  }
}
const openai = new OpenAI();

module.exports = openai;
