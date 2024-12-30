import { CheckApiKeyUsecase } from '@core/usecases/auth';
import { ApiKeyApplicationRepositoryProvider } from '@core/providers/repositories';
import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';
import { CustomUnauthorizedException } from '@core/domain/exceptions';

export class CheckApiKeyUsecaseImpl implements CheckApiKeyUsecase {
  constructor(private readonly repositoryProvider: ApiKeyApplicationRepositoryProvider) {}

  public async execute(apiKey: string): Promise<ApikeyApplicationCoreEntity> {
    if (!apiKey || apiKey === '') {
      throw new CustomUnauthorizedException();
    }

    const apiKeyApplication = await this.repositoryProvider.findByApiKey(apiKey);
    if (!apiKeyApplication) {
      throw new CustomUnauthorizedException();
    }

    if (!apiKeyApplication.userId || apiKeyApplication.userId === '') {
      throw new CustomUnauthorizedException();
    }

    return apiKeyApplication;
  }
}
