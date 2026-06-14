import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiError, errorCodeForStatus } from "../http/api-error";

/**
 * Catches all exceptions and serializes them into the stable ApiError envelope.
 * Unknown (non-HttpException) errors are logged server-side and returned as a
 * generic 500 — stack traces are never exposed to the client.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    let isValidationError = false;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const body = res as Record<string, unknown>;
        const bodyMessage = body.message as string | string[] | undefined;
        message = bodyMessage ?? exception.message;
        // class-validator (via ValidationPipe) yields a 400 with a string[]
        // of messages. Surface these as VALIDATION_ERROR per AURA API Design.
        if (
          statusCode === HttpStatus.BAD_REQUEST &&
          Array.isArray(bodyMessage)
        ) {
          isValidationError = true;
        }
      }
    } else {
      // Unknown error — log full detail server-side, return generic to client.
      this.logger.error(exception);
    }

    const code = isValidationError
      ? "VALIDATION_ERROR"
      : errorCodeForStatus(statusCode);

    const payload: ApiError = {
      error: {
        code,
        message,
        details: {
          statusCode,
          path: request.url,
          timestamp: new Date().toISOString(),
        },
      },
    };

    response.status(statusCode).json(payload);
  }
}
