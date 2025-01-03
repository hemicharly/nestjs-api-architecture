import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';

export interface ApikeyapplicationRepositoryProviderInterface {
  save(entityCore: ApikeyApplicationCoreEntity): Promise<ApikeyApplicationCoreEntity>;

  findByApiKey(apiKey: string): Promise<ApikeyApplicationCoreEntity>;
}
