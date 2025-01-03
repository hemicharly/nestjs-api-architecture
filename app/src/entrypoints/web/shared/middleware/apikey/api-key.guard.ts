import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CheckApiKeyUsecaseInterface } from '@core/usecases/auth';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  @Inject(CheckApiKeyUsecaseImpl)
  private readonly checkApiKeyUsecase: CheckApiKeyUsecaseInterface;

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const xApiKey = <string>request.headers['x-api-key'] || null;
    const path = request.method + ' ' + request.route.path;
    const entity = await this.checkApiKeyUsecase.execute(xApiKey, path);
    request.userId = entity.userId;
    return true;
  }
}
