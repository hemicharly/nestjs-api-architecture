import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';

export interface CheckApiKeyUsecaseInterface {
  execute(apiKey: string, path: string): Promise<ApikeyApplicationCoreEntity>;
}
