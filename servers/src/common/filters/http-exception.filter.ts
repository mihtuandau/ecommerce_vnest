
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;  // Đổi const thành let

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') status = HttpStatus.CONFLICT;  
      else if (exception.code === 'P2025') status = HttpStatus.NOT_FOUND;  
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
}