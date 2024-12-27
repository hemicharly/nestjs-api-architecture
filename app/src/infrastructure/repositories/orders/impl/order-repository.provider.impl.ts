import { OrderRepositoryProvider } from '@core/providers/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  OrderCoreEntity,
  OrderEndCoreEntity,
  OrderPaginationCoreEntity,
  OrderQuantityStatusEntity,
  OrderQueryCoreEntity,
  OrderQueryQuantityStatusCoreEntity,
  OrderStartCoreEntity,
} from '@core/domain/entities/orders';
import { MongoRepository } from 'typeorm/repository/MongoRepository';
import { OrderEntity } from '@infrastructure/repositories/orders/entity';
import { OrderInfraMapper } from 'src/infrastructure/repositories/orders/mappers';
import { OrderAggregationResult } from '@infrastructure/repositories/orders/types';

@Injectable()
export class OrderRepositoryProviderImpl implements OrderRepositoryProvider {
  protected readonly mongoRepository: MongoRepository<OrderEntity>;

  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {
    this.mongoRepository = this.repository.manager.getMongoRepository(OrderEntity);
  }

  public async save(entityCore: Partial<OrderCoreEntity>): Promise<OrderCoreEntity> {
    const entity = OrderInfraMapper.toDbEntity(entityCore);
    const entitySaved = await this.repository.save(entity);
    return OrderInfraMapper.toCoreEntity(entitySaved);
  }

  public async updateStart(id: string, entityCore: OrderStartCoreEntity): Promise<void> {
    const entity = OrderInfraMapper.fromOrderStartCoreEntity(entityCore);
    await this.mongoRepository.updateOne({ _id: new ObjectId(id) }, { $set: entity });
  }

  public async updateEnd(id: string, entityCore: OrderEndCoreEntity): Promise<void> {
    const entity = OrderInfraMapper.fromOrderEndCoreEntity(entityCore);
    await this.mongoRepository.updateOne({ _id: new ObjectId(id) }, { $set: entity });
  }

  public async findByIdAndEmployeeId(id: string, employeeId: string): Promise<OrderCoreEntity> {
    const entity = await this.repository.findOneBy({
      _id: new ObjectId(id),
      employeeId,
    });
    return OrderInfraMapper.toCoreEntity(entity);
  }

  public async find(queryCore: OrderQueryCoreEntity): Promise<OrderPaginationCoreEntity> {
    const findQuery = OrderInfraMapper.builderFindQuery(queryCore);
    const [entityList, total] = await this.repository.findAndCount(findQuery);
    return OrderInfraMapper.toPaginationCoreEntity(entityList, total, queryCore.pagination);
  }

  public async countByEmployeeIdAndDateAndStatus(queryCore: OrderQueryQuantityStatusCoreEntity): Promise<OrderQuantityStatusEntity[]> {
    const aggregateQuery = OrderInfraMapper.builderAggregateQuery(queryCore);
    const aggregationResult = await this.mongoRepository
      .aggregate(aggregateQuery)
      .project<OrderAggregationResult>({
        status: '$status',
        year: '$year',
        month: '$month',
        week: '$week',
        day: '$day',
        count: 1,
      })
      .toArray();
    return OrderInfraMapper.fromAggregationResult(aggregationResult);
  }
}
