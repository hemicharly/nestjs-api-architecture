import { ApikeyApplicationCoreEntity } from '@core/domain/entities/auth';
import { ApiKeyApplication } from '@infrastructure/repositories/auth/entity';

export class ApikeyApplicationInfraTransformer {
  public static toDbEntity(entityCore: ApikeyApplicationCoreEntity): ApiKeyApplication {
    if (!entityCore) {
      return null;
    }

    const dbEntity = new ApiKeyApplication();
    dbEntity.apiKey = entityCore.apiKey;
    dbEntity.description = entityCore.description;
    dbEntity.userId = entityCore.userId;
    dbEntity.createdAt = new Date().toJSON();
    return dbEntity;
  }

  public static toCoreEntity(entity: ApiKeyApplication): ApikeyApplicationCoreEntity {
    if (!entity) {
      return null;
    }

    const coreEntity = new ApikeyApplicationCoreEntity();
    coreEntity.id = entity._id.toString();
    coreEntity.apiKey = entity.apiKey;
    coreEntity.description = entity.description;
    coreEntity.userId = entity.userId;
    coreEntity.createdAt = entity.createdAt;
    return coreEntity;
  }
}
