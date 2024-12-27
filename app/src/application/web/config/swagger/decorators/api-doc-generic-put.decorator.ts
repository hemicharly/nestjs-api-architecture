import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '@application/web/response/error/error.response';

export function ApiDocGenericPut(value: string, modelType?: Type) {
  return applyDecorators(
    ApiOperation({ summary: `Update the ${value} by id.` }),
    modelType
      ? ApiOkResponse({
          description: `Data from ${value} requested.`,
          type: modelType,
        })
      : ApiNoContentResponse({
          description: `Data from ${value} requested.`,
        }),
    ApiBadRequestResponse({ description: `Bad request.`, type: ErrorResponse }),
    ApiConflictResponse({ description: 'Conflict of resource.', type: ErrorResponse }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.', type: ErrorResponse }),
    ApiNotFoundResponse({ description: 'Resource not found.', type: ErrorResponse }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.', type: ErrorResponse }),
  );
}
