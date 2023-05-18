import { Message } from "@/types/chat";
import { OpenAIModel } from "@/types/openai";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

const OPENAI_API_HOST = "https://api.openai.com";
export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  key: string
) => {
  const data = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: model.id,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      // max_tokens: 10000,
      // temperature: 1,
      // stream: true,
    }),
  }).then((res) => res.json());
  return data.choices[0].message.content;
  // console.log(res, "res");
  // const encoder = new TextEncoder();
  // const decoder = new TextDecoder();

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const onParse = (event: ParsedEvent | ReconnectInterval) => {
  //       if (event.type === "event") {
  //         const data = event.data;

  //         if (data === "[DONE]") {
  //           controller.close();
  //           return;
  //         }

  //         try {
  //           const json = JSON.parse(data);
  //           const text = json.choices[0].delta.content;
  //           const queue = encoder.encode(text);
  //           controller.enqueue(queue);
  //         } catch (e) {
  //           controller.error(e);
  //         }
  //       }
  //     };

  //     const parser = createParser(onParse);

  //     for await (const chunk of res.body as any) {
  //       parser.feed(decoder.decode(chunk));
  //     }
  //   },
  // });

  // return stream;
};
