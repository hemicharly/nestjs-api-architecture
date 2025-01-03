import { CheckApiKeyUsecaseInterface } from '@core/usecases/auth';
import { ApikeyapplicationRepositoryProviderInterface } from '@core/providers/repositories';
import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';
import { CustomForbiddenException, CustomUnauthorizedException } from '@core/domain/exceptions';

export class CheckApiKeyUsecaseImpl implements CheckApiKeyUsecaseInterface {
  constructor(private readonly repositoryProvider: ApikeyapplicationRepositoryProviderInterface) {}

  public async execute(apiKey: string, path: string): Promise<ApikeyApplicationCoreEntity> {
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

    if (!this.canAccessPath(path, apiKeyApplication?.rulesPaths || [])) {
      throw new CustomForbiddenException();
    }

    return apiKeyApplication;
  }

  private canAccessPath(path: string, rulesPaths: string[]): boolean {
    if (rulesPaths.length === 0) {
      return false;
    }

    if (rulesPaths.length === 1 && rulesPaths.includes('*')) {
      return true;
    }

    return path && rulesPaths.includes(path);
  }
}
