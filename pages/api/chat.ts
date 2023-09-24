import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    console.log('Handler initiated');

    const { userId, model, messages, key, prompt, temperature } =
      (await req.json()) as ChatBody;
    console.log(
      `Received data: User ID ${userId}, model ${model.name}, messages number ${messages.length}`,
    );

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    console.log(`WebAssembly init succeeded`);

    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );
    console.log(`Tiktoken obj created`);

    let promptToSend = prompt;
    let temperatureToUse = temperature;

    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
      console.log(`Prompt sent`);
    }

    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
      console.log(`Temperature set`);
    }

    const prompt_tokens = encoding.encode(promptToSend);
    console.log(`Prompt tokens: ${prompt_tokens.length}`);

    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = encoding.encode(message.content);
      console.log(`Message: ${message.id}, Tokens: ${tokens.length}`);

      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        console.log(`Token count exceeded limit for the model.`);
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }
    console.log(`Finished message tokenization`);

    encoding.free();
    console.log(`Encoding object freed`);

    const stream = await OpenAIStream(
      userId,
      model,
      promptToSend,
      temperatureToUse,
      key,
      messagesToSend,
    );
    console.log(`Stream created`);

    return new Response(stream);
  } catch (error) {
    console.error(`Encountered an error: ${error}`);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
