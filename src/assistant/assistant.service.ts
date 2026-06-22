import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { QuestionDto } from './dtos/question.dto';
import { createThreadUseCase, createMessageUseCase, createRunUseCase, checkCompleteStatusUseCase, getMessageListUseCase } from './use-cases';

@Injectable()
export class AssistantService {


  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  async createThread(){
    return await createThreadUseCase(this.openai);
  }


  async userQuestion( questionDto:QuestionDto){
    const { threadId, question } = questionDto;
    const message = await createMessageUseCase(this.openai, {threadId, question});
    const run     = await createRunUseCase(this.openai, {threadId});
    // await checkCompleteStatusUseCase(this.openai, {threadId, assistantId: run.assistant_id});
    const messages = await getMessageListUseCase(this.openai, {threadId});
    return messages.reverse();  
  }
}
