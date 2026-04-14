import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConstDiscusserDto, TextToAudioDto, TranslateTextDto,  } from './dtos';
import type{ Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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


  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res:Response
  ){
    const filePath = await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/wav');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }


  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res:Response,
    @Param('fileId') fileId: string
  ){
    const filePath = await this.gptService.textToAudioGetter(fileId);
    res.setHeader('Content-Type', 'audio/wav');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }


  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './audios/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${Date.now()}.${fileExtension}`;
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile( new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5, message: 'El archivo es demasiado grande' }),
        // new FileTypeValidator({ fileType: 'audio/*',})
      ]
    })) file: Express.Multer.File,
    @Body() audioToTextDto: TextToAudioDto
  ){
    return this.gptService.audioToText(file, audioToTextDto);
  }
}
