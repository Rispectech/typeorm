import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import chalk from 'chalk';
import axios from 'axios';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    const commonFields = {
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };

    let errorResponse;
    let stackTrace;
    const errors = [];
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorObject: { message: string } = exception
        .getResponse()
        .valueOf() as {
        message: string;
      };
      if (errorObject.message) {
        errors.push({ description: errorObject.message });
      }
      errorResponse = { errors, ...commonFields };
    } else {
      const message =
        exception instanceof Error
          ? exception.message
          : 'Internal Server Error';
      errors.push({ description: message });
      errorResponse = {
        exception,
        errors,
        ...commonFields,
        statusCode: 500,
      };
      stackTrace = axios.isAxiosError(errorResponse.exception)
        ? JSON.stringify(errorResponse.exception.toJSON())
        : exception;
      console.error(stackTrace);
    }
    console.info(
      chalk.red(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          status: status,
          method: request.method,
          url: request.originalUrl,
          query: request.query ? request.query : undefined,
          params: request.params ? request.params : undefined,
          body: request.body ? request.body : undefined,
          userId: request.user ? request.user.id : undefined,
          message: errorResponse.message,
          stackTrace: stackTrace,
        }),
      ),
    );
    response.status(status).json(errorResponse);
  }
}
