import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';

export interface ApiKeyApplicationRepositoryProvider {
  save(entityCore: ApikeyApplicationCoreEntity): Promise<ApikeyApplicationCoreEntity>;

  findByApiKey(apiKey: string): Promise<ApikeyApplicationCoreEntity>;
}
