import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Terjadi kesalahan pada server';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const res = exceptionResponse as any;
                message = res.message ?? message;
                error = res.error ?? HttpStatus[status];
            }
        } else if (exception instanceof Error) {
            // Error tak terduga (bug)
            message = exception.message;
            error = 'Internal Server Error';
        }

        response.status(status).json({
            statusCode: status,
            error,
            message,
            timeStamp: new Date().toISOString(),
            path: request.url,
        });
    }
}