import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ErrorResponse } from '@entrypoints/web/shared/response/error';

export function ApiDocGenericGetPagination(
  value: string,
  modelType: Type
): <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>
) => void {
  return applyDecorators(
    ApiOperation({ summary: `Return all from ${value} with pagination.` }),
    ApiOkResponse({
      description: `Returns all data from ${value} with pagination.`,
      type: modelType,
      isArray: true
    }),
    ApiBadRequestResponse({ description: 'Bad request.', type: ErrorResponse }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.', type: ErrorResponse }),
    ApiForbiddenResponse({ description: 'Forbidden.', type: ErrorResponse }),
    ApiNotFoundResponse({ description: 'Resource not found.', type: ErrorResponse }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.', type: ErrorResponse })
  );
}
