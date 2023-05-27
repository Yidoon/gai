import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import { OpenAIStream } from "@/server/openai";
import { OpenAIModelID } from "@/types/openai";

dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
  } else {
    const { prompt } = req.query;
    console.log(req.method, "method");
    console.log(req.query, "query");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    if (prompt) {
      const data = await OpenAIStream(
        {
          id: OpenAIModelID.GPT_3_5,
          name: "GPT-3.5",
          maxLength: 12000,
          tokenLimit: 3000,
        },
        prompt,
        process.env.OPENAI_API_KEY!
      );
      console.log(data, "data");
      res.json({
        data: data,
        msg: "",
        code: 0,
      });
      res.end();
    } else {
      res.json({
        data: "",
        msg: "",
        code: 10001,
      });
      res.end();
    }
  }
}
