import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponse } from '@application/web/shared/response/error';

export function ApiDocGenericGetAll(value: string, modelType: Type) {
  return applyDecorators(
    ApiOperation({ summary: `Return all of the ${value}.` }),
    ApiOkResponse({
      description: `Return all of the ${value}.`,
      type: modelType,
      isArray: true,
    }),
    ApiBadRequestResponse({ description: 'Bad request.', type: ErrorResponse }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.', type: ErrorResponse }),
    ApiNotFoundResponse({ description: 'Resource not found.', type: ErrorResponse }),
    ApiInternalServerErrorResponse({ description: 'Internal server error', type: ErrorResponse }),
  );
}
