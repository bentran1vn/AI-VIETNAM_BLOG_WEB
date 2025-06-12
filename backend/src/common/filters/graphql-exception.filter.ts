import { Catch, ArgumentsHost } from "@nestjs/common";
import { GqlExceptionFilter, GqlArgumentsHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

interface NestException {
  status?: number;
  message?: string;
  response?: {
    message?: string | string[];
    error?: string;
  };
}

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    if (exception instanceof GraphQLError) {
      return exception;
    }

    const nestException = exception as NestException;

    // Handle NestJS HTTP exceptions
    if (nestException.status) {
      const message = nestException.response?.message || nestException.message || "Unknown error";
      const errorMessage = Array.isArray(message) ? message[0] : message;

      return new GraphQLError(errorMessage, {
        extensions: {
          code: nestException.status,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Handle other errors
    const error = exception as Error;
    return new GraphQLError(error.message || "Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        timestamp: new Date().toISOString(),
        stacktrace: error.stack,
      },
    });
  }
}
