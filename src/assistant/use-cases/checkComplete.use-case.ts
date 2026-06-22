import { InternalServerErrorException } from "@nestjs/common";
import OpenAI from "openai";


interface Options {
  threadId: string;
  assistantId: string;
}


export const checkCompleteStatusUseCase = async (openai:OpenAI, options:Options) => {


  const { threadId, assistantId } = options;

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId
  });

  if(run.status === 'failed'){
    throw new InternalServerErrorException('Run failed'); 
  }

  return run;
}