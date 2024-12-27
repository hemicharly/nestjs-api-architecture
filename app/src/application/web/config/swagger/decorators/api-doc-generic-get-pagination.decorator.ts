import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponse } from '@application/web/response/error/error.response';

export function ApiDocGenericGetPagination(value: string, modelType: Type) {
  return applyDecorators(
    ApiOperation({ summary: `Return all from ${value} with pagination.` }),
    ApiOkResponse({
      description: `Returns all data from ${value} with pagination.`,
      type: modelType,
      isArray: true,
    }),
    ApiBadRequestResponse({ description: 'Bad request.', type: ErrorResponse }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.', type: ErrorResponse }),
    ApiNotFoundResponse({ description: 'Resource not found.', type: ErrorResponse }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.', type: ErrorResponse }),
  );
}
