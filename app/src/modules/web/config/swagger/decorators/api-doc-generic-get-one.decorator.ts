import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponse } from '@application/web/common/response/error';

export function ApiDocGenericGetOne(value: string, modelType: Type) {
  return applyDecorators(
    ApiOperation({ summary: `Return the ${value} by id.` }),
    ApiOkResponse({
      description: `Data from ${value} requested.`,
      type: modelType,
    }),
    ApiBadRequestResponse({ description: 'Bad request.', type: ErrorResponse }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.', type: ErrorResponse }),
    ApiNotFoundResponse({ description: 'Resource not found.', type: ErrorResponse }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.', type: ErrorResponse }),
  );
}
