import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Timeout');
  private readonly timeoutMs = 30000; 

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          const request = context.switchToHttp().getRequest();
          const { method, url } = request;
          this.logger.warn(`Request timeout: ${method} ${url} (>${this.timeoutMs}ms)`);
          return throwError(() => new RequestTimeoutException(
            `Request timed out after ${this.timeoutMs / 1000}s. Please try again.`,
          ));
        }
        return throwError(() => err);
      }),
    );
  }
}






