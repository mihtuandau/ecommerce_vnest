import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * LoggingInterceptor - Ghi log request/response timing
 * 
 * Tự động log:
 * - Method + URL
 * - User ID (nếu authenticated)
 * - Response time (ms)
 * - Cảnh báo nếu response chậm (> 3s)
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userId = request.user?.sub || 'anonymous';
    const userAgent = request.headers['user-agent'] || 'unknown';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          const logMessage = `${method} ${url} ${statusCode} - ${duration}ms [${userId}] [${ip}]`;

          // Cảnh báo request chậm
          if (duration > 3000) {
            this.logger.warn(`SLOW REQUEST: ${logMessage} | UA: ${userAgent}`);
          } else {
            this.logger.log(logMessage);
          }
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${url} ${error.status || 500} - ${duration}ms [${userId}] [${ip}] | ${error.message}`,
          );
        },
      }),
    );
  }
}
