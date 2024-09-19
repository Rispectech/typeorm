import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - startTime;
        console.info(
          chalk.green(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              status: response.statusCode,
              method: request.method,
              url: request.originalUrl,
              query: request.query ? request.query : undefined,
              params: request.params ? request.params : undefined,
              body: request.body ? JSON.stringify(request.body) : undefined,
              responseTime: `${delay}ms`,
            }),
          ),
        );
      }),
    );
  }
}
