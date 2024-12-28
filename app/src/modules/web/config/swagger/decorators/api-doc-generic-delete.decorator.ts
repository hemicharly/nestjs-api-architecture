import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponse } from '@application/web/common/response/error';

export function ApiDocGenericDelete(value: string, modelType?: Type) {
  return applyDecorators(
    ApiOperation({ summary: `Delete a ${value}` }),
    modelType
      ? ApiOkResponse({
          description: `Data from ${value} deleted.`,
          type: modelType,
        })
      : ApiNoContentResponse({
          description: `Data from ${value} deleted.`,
        }),
    ApiBadRequestResponse({ description: 'Bad request.', type: ErrorResponse }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.', type: ErrorResponse }),
    ApiNotFoundResponse({ description: 'Resource not found.', type: ErrorResponse }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.', type: ErrorResponse }),
  );
}
