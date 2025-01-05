import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import {
  OrderCoreEntity,
  OrderEndCoreEntity,
  OrderPaginationCoreEntity,
  OrderQuantityStatusEntity,
  OrderQueryCoreEntity,
  OrderQueryQuantityStatusCoreEntity,
  OrderStartCoreEntity
} from '@core/domain/entities/orders';
import { PaginationCoreEntity } from '@core/domain/entities/shared';
import { OrderEntity } from '@infrastructure/repositories/orders/entity';
import { OrderStatus, PeriodGroup } from '@core/domain/enums';
import { OrderAggregationResultType } from '@infrastructure/repositories/orders/types';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export class OrderInfraMapper {
  public static toDbEntity(entityCore: Partial<OrderCoreEntity>): Partial<OrderEntity> {
    if (!entityCore) {
      return null;
    }
    return {
      employeeId: entityCore.employeeId,
      serviceDescription: entityCore.serviceDescription,
      companyName: entityCore.companyName,
      companyAddressLatitude: entityCore.companyAddressLatitude,
      companyAddressLongitude: entityCore.companyAddressLongitude,
      schedulingDate: entityCore.schedulingDate,
      status: entityCore.status.toString(),
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON()
    };
  }

  public static fromOrderStartCoreEntity(entityCore: OrderStartCoreEntity): Partial<OrderEntity> {
    if (!entityCore) {
      return null;
    }
    return {
      startDatetime: entityCore.startDatetime,
      recordedLatitude: entityCore.recordedLatitude,
      recordedLongitude: entityCore.recordedLongitude,
      status: entityCore.status.toString(),
      updatedAt: new Date().toJSON()
    };
  }

  public static fromOrderEndCoreEntity(entityCore: OrderEndCoreEntity): Partial<OrderEntity> {
    if (!entityCore) {
      return null;
    }
    return {
      endDatetime: entityCore.endDatetime,
      recordedLatitude: entityCore.recordedLatitude,
      recordedLongitude: entityCore.recordedLongitude,
      endComment: entityCore?.endComment || null,
      status: entityCore.status.toString(),
      updatedAt: new Date().toJSON()
    };
  }

  public static toCoreEntity(entity: OrderEntity): OrderCoreEntity {
    if (!entity) {
      return null;
    }

    const coreEntity = new OrderCoreEntity(entity.startDatetime, entity.endDatetime);
    coreEntity.id = entity._id.toString();
    coreEntity.employeeId = entity.employeeId;
    coreEntity.serviceDescription = entity.serviceDescription;
    coreEntity.companyName = entity.companyName;
    coreEntity.companyAddressLatitude = entity.companyAddressLatitude;
    coreEntity.companyAddressLongitude = entity.companyAddressLongitude;
    coreEntity.recordedLatitude = entity.recordedLatitude;
    coreEntity.recordedLongitude = entity.recordedLongitude;
    coreEntity.schedulingDate = entity.schedulingDate;
    coreEntity.endComment = entity.endComment;
    coreEntity.status = entity.status ? OrderStatus[entity.status] : null;
    coreEntity.createdAt = entity.createdAt;
    coreEntity.updatedAt = entity.updatedAt;
    return coreEntity;
  }

  public static toCoreEntityList(entityList: OrderEntity[]): OrderCoreEntity[] {
    if (entityList?.length === 0) {
      return [];
    }
    return entityList.map((item) => this.toCoreEntity(item));
  }

  public static toPaginationCoreEntity(
    entityList: OrderEntity[],
    total: number,
    paginationCore: PaginationCoreEntity
  ): OrderPaginationCoreEntity {
    const items = this.toCoreEntityList(entityList);
    return new OrderPaginationCoreEntity({ ...paginationCore, total }, items);
  }

  public static builderFindQuery(queryCore: OrderQueryCoreEntity): FindManyOptions<OrderEntity> {
    const {
      employeeId,
      startDate,
      endDate,
      status,
      pagination: { page, pageSize }
    } = queryCore;

    const where: FindOptionsWhere<any> = { employeeId };
    if (startDate && endDate) {
      where.schedulingDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (status) {
      where.status = status.valueOf();
    }

    const pageNum = Math.max(1, parseInt(page as any, 10) || 1);
    const limitNum = Math.max(1, parseInt(pageSize as any, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    return {
      where,
      order: {
        schedulingDate: 'DESC',
        createdAt: 'DESC'
      },
      skip,
      take: limitNum
    };
  }

  public static builderAggregateQuery(
    queryCore: OrderQueryQuantityStatusCoreEntity
  ): ObjectLiteral[] {
    const { employeeId, groupingPeriod, startDate, endDate, status } = queryCore;
    const match: any = {
      employeeId,
      schedulingDate: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (status) {
      match.status = status.valueOf();
    }

    const group = this.builderGroup(groupingPeriod);

    return [
      {
        $match: match
      },
      {
        $addFields: {
          schedulingDate: {
            $dateFromString: {
              dateString: '$schedulingDate',
              format: '%Y-%m-%d'
            }
          }
        }
      },
      {
        $group: group
      },
      {
        $project: {
          _id: 0,
          status: '$_id.status',
          year: '$_id.year',
          month: '$_id.month',
          week: '$_id.week',
          day: '$_id.day',
          count: 1
        }
      },
      {
        $sort: { year: 1, month: 1, week: 1, day: 1, status: 1 }
      }
    ];
  }

  public static fromAggregationResult(
    aggregationResult: OrderAggregationResultType[]
  ): OrderQuantityStatusEntity[] {
    if (aggregationResult?.length === 0) {
      return [];
    }
    return aggregationResult.map(
      (item) =>
        new OrderQuantityStatusEntity(
          item.count,
          item.year,
          item.month,
          item.week,
          item.day,
          item.status as OrderStatus
        )
    );
  }

  private static builderGroup(groupingPeriod: PeriodGroup): any {
    const options = {
      YEARLY: {
        _id: {
          status: '$status',
          year: { $year: '$schedulingDate' }
        },
        count: { $sum: 1 }
      },
      MONTHLY: {
        _id: {
          status: '$status',
          year: { $year: '$schedulingDate' },
          month: { $month: '$schedulingDate' }
        },
        count: { $sum: 1 }
      },
      WEEKLY: {
        _id: {
          status: '$status',
          year: { $year: '$schedulingDate' },
          month: { $month: '$schedulingDate' },
          week: { $week: '$schedulingDate' }
        },
        count: { $sum: 1 }
      },
      DAILY: {
        _id: {
          status: '$status',
          year: { $year: '$schedulingDate' },
          month: { $month: '$schedulingDate' },
          week: { $week: '$schedulingDate' },
          day: { $dayOfMonth: '$schedulingDate' }
        },
        count: { $sum: 1 }
      }
    };

    return options[groupingPeriod];
  }
}
