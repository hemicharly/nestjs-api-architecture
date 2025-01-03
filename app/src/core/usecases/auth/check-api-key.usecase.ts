import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';

export interface CheckApiKeyUsecase {
  execute(apiKey: string, path: string): Promise<ApikeyApplicationCoreEntity>;
}
