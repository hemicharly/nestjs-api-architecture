import { ApikeyapplicationRepositoryProviderInterface } from '@core/providers/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';
import { ApiKeyApplication } from '@infrastructure/repositories/auth/entity';
import { ApikeyApplicationInfraTransformer } from '@infrastructure/repositories/auth/transformers';

@Injectable()
export class ApiKeyApplicationRepositoryProviderImpl
  implements ApikeyapplicationRepositoryProviderInterface
{
  constructor(
    @InjectRepository(ApiKeyApplication)
    private readonly repository: Repository<ApiKeyApplication>
  ) {}

  public async save(entityCore: ApikeyApplicationCoreEntity): Promise<ApikeyApplicationCoreEntity> {
    const entity = ApikeyApplicationInfraTransformer.toDbEntity(entityCore);
    const entitySaved = await this.repository.save(entity);
    return ApikeyApplicationInfraTransformer.toCoreEntity(entitySaved);
  }

  public async findByApiKey(apiKey: string): Promise<ApikeyApplicationCoreEntity> {
    const entity = await this.repository.findOneBy({ apiKey });
    return ApikeyApplicationInfraTransformer.toCoreEntity(entity);
  }
}
