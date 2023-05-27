import { OpenAIApi, Configuration } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

class OpenAI {
  configuration: Configuration;
  openai: OpenAIApi;
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.configuration = configuration;
    this.openai = new OpenAIApi(configuration);
  }
  async createCompletion(options: { prompt: string }) {
    const { prompt } = options;
    const response = await this.openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 7,
      temperature: 0,
    });
    console.log(response, "response");
    console.log(response.data.choices[0].text);
  }
}

const openai = new OpenAI();
export default openai;
