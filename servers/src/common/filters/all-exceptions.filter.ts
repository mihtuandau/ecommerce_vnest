import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = 500;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        errorCode =
          responseObj.errorCode || this.getErrorCodeFromStatus(status);
        details = responseObj.details;
      } else {
        message = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(status);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'UNKNOWN_ERROR';

      // Parse specific error messages for better context
      if (message.includes('Sản phẩm hết hàng')) {
        status = 400;
        errorCode = 'OUT_OF_STOCK';
      } else if (message.includes('Mã giảm giá')) {
        status = 400;
        errorCode = 'INVALID_DISCOUNT';
      } else if (message.includes('Giỏ hàng trống')) {
        status = 400;
        errorCode = 'EMPTY_CART';
      } else if (message.includes('không tồn tại')) {
        status = 404;
        errorCode = 'NOT_FOUND';
      }
    }

    // Log error for debugging
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${errorCode}: ${message}`,
      );
    }

    const errorResponse = {
      success: false,
      status,
      errorCode,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' &&
        exception instanceof Error && { stack: exception.stack }),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCodeFromStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };
    return statusMap[status] || 'UNKNOWN_ERROR';
  }
}
