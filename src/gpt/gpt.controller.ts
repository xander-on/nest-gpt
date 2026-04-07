import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConstDiscusserDto, TranslateTextDto,  } from './dtos';
import type{ Response } from 'express';

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ){
    return this.gptService.orthographyCheck(orthographyDto);
  }


  @Post('pros-cons-discusser')
  prosConsDiscusser(
    @Body() prosConsDiscusserDto: ProsConstDiscusserDto
  ){
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }


  @Post('pros-cons-stream')
  async prosConsStream(
    @Body() prosConsDiscusserDto: ProsConstDiscusserDto,
    @Res() res:Response
  ){
    const stream = await this.gptService.prosConsStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream)
      res.write(chunk);

    res.end();
  }



  @Post('translate')
  translateText( @Body() translateTextDto: TranslateTextDto){
    return this.gptService.translateText(translateTextDto);
  }
}
