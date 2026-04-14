import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {

    const ctx      = host.switchToHttp();
    const response = ctx.getResponse();
    const request  = ctx.getRequest();

    // 🔥 Manejo específico de Gemini / IA
    if (exception?.status === 503) {
      return response.status(503).json({
        statusCode: 503,
        message: 'El servicio de IA está saturado, intenta más tarde',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // 🔥 Si es un error de Nest
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // 🔥 Error genérico
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Error interno del servidor',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}