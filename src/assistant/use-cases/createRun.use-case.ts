import { InternalServerErrorException } from "@nestjs/common";
import OpenAI from "openai";


interface Options{
  threadId:string;
  assistantId?:string
}



export const createRunUseCase = async(openia: OpenAI, options:Options) => {
  
  const { threadId, assistantId = 'asst_QPU1EX9If583Y0zTQgBNMUqh'} = options;

  const run = await openia.beta.threads.runs.createAndPoll( threadId, { 
    assistant_id: assistantId 
  });

  if(run.status === 'failed'){
    throw new InternalServerErrorException('Run failed'); 
  }

  console.log({status: run.status});
  return run;
}
