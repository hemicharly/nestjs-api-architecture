import {
  OrderCoreEntity,
  OrderEndCoreEntity,
  OrderPaginationCoreEntity,
  OrderStartCoreEntity
} from '@core/domain/entities/orders';
import { PaginationCoreEntity } from '@core/domain/entities/shared';
import { OrderStatus, PeriodGroup } from '@core/domain/enums';
import { ObjectId } from 'mongodb';
import { OrderInfraMapper } from '@infrastructure/repositories/orders/mappers';
import { OrderEntity } from '@infrastructure/repositories/orders/entity';

/**
 * Implementation of test to 'order-infra.mapper.ts'
 */
describe('order-infra.mapper.ts', () => {
  describe('toDbEntity', () => {
    it('should map OrderCoreEntity to OrderEntity', () => {
      const coreEntity: Partial<OrderCoreEntity> = {
        employeeId: '123',
        serviceDescription: 'Delivery',
        companyName: 'Company A',
        companyAddressLatitude: '45.0',
        companyAddressLongitude: '-93.0',
        schedulingDate: '2023-01-01',
        status: OrderStatus.FINISHED
      };

      const result = OrderInfraMapper.toDbEntity(coreEntity);

      expect(result).toEqual(
        expect.objectContaining({
          employeeId: '123',
          serviceDescription: 'Delivery',
          companyName: 'Company A',
          companyAddressLatitude: '45.0',
          companyAddressLongitude: '-93.0',
          schedulingDate: '2023-01-01',
          status: OrderStatus.FINISHED
        })
      );
    });

    it('should return null if input is null', () => {
      expect(OrderInfraMapper.toDbEntity(null)).toBeNull();
    });
  });

  describe('fromOrderStartCoreEntity', () => {
    it('should map OrderStartCoreEntity to OrderEntity', () => {
      const coreEntity: OrderStartCoreEntity = {
        startDatetime: '2023-01-01T10:00:00Z',
        recordedLatitude: '45.0',
        recordedLongitude: '-93.0',
        status: OrderStatus.IN_PROGRESS,
        id: '1',
        employeeId: '123456'
      };

      const result = OrderInfraMapper.fromOrderStartCoreEntity(coreEntity);

      expect(result).toEqual(
        expect.objectContaining({
          startDatetime: '2023-01-01T10:00:00Z',
          recordedLatitude: '45.0',
          recordedLongitude: '-93.0',
          status: 'IN_PROGRESS'
        })
      );
    });

    it('should return null if input is null', () => {
      expect(OrderInfraMapper.fromOrderStartCoreEntity(null)).toBeNull();
    });
  });

  describe('fromOrderEndCoreEntity', () => {
    it('should map OrderEndCoreEntity to OrderEntity', () => {
      const coreEntity: OrderEndCoreEntity = {
        endDatetime: '2023-01-01T12:00:00Z',
        recordedLatitude: '45.0',
        recordedLongitude: '-93.0',
        endComment: 'Completed successfully',
        status: OrderStatus.FINISHED,
        employeeId: '123',
        id: ''
      };

      const result = OrderInfraMapper.fromOrderEndCoreEntity(coreEntity);

      expect(result).toEqual(
        expect.objectContaining({
          endDatetime: '2023-01-01T12:00:00Z',
          recordedLatitude: '45.0',
          recordedLongitude: '-93.0',
          endComment: 'Completed successfully',
          status: OrderStatus.FINISHED
        })
      );
    });

    it('should return null if input is null', () => {
      expect(OrderInfraMapper.fromOrderEndCoreEntity(null)).toBeNull();
    });
  });

  describe('toCoreEntity', () => {
    it('should map OrderEntity to OrderCoreEntity', () => {
      const entity: OrderEntity = {
        _id: new ObjectId('677988e253236b64c66708a7'),
        employeeId: '123',
        serviceDescription: 'Delivery',
        companyName: 'Company A',
        companyAddressLatitude: '45.0',
        companyAddressLongitude: '-93.0',
        recordedLatitude: '45.0',
        recordedLongitude: '-93.0',
        schedulingDate: '2023-01-01',
        endComment: 'Completed successfully',
        status: OrderStatus.FINISHED,
        createdAt: '2023-01-01T09:00:00Z',
        updatedAt: '2023-01-01T10:00:00Z'
      };

      const result = OrderInfraMapper.toCoreEntity(entity);

      expect(result).toBeInstanceOf(OrderCoreEntity);
      expect(result).toEqual(
        expect.objectContaining({
          id: '677988e253236b64c66708a7',
          employeeId: '123',
          serviceDescription: 'Delivery',
          companyName: 'Company A',
          status: OrderStatus.FINISHED
        })
      );
    });

    it('should return null if input is null', () => {
      expect(OrderInfraMapper.toCoreEntity(null)).toBeNull();
    });
  });

  describe('toCoreEntityList', () => {
    it('should map an array of OrderEntity to an array of OrderCoreEntity', () => {
      const entities: OrderEntity[] = [
        {
          _id: new ObjectId('677988e253236b64c66708a7'),
          employeeId: '123',
          serviceDescription: 'Delivery',
          companyName: 'Company A',
          companyAddressLatitude: '45.0',
          companyAddressLongitude: '-93.0',
          status: OrderStatus.FINISHED,
          recordedLatitude: '45.0',
          recordedLongitude: '-93.0',
          schedulingDate: '2023-01-01',
          endComment: 'Completed successfully',
          createdAt: '2023-01-01T09:00:00Z',
          updatedAt: '2023-01-01T10:00:00Z'
        }
      ];

      const result = OrderInfraMapper.toCoreEntityList(entities);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderCoreEntity);
    });

    it('should return an empty array if input is empty', () => {
      expect(OrderInfraMapper.toCoreEntityList([])).toEqual([]);
    });
  });

  describe('toPaginationCoreEntity', () => {
    it('should map OrderEntity array and pagination to OrderPaginationCoreEntity', () => {
      const entities: OrderEntity[] = [
        {
          _id: new ObjectId('677988e253236b64c66708a7'),
          employeeId: '123',
          serviceDescription: 'Delivery',
          companyName: 'Company A',
          status: OrderStatus.FINISHED,
          companyAddressLatitude: '45.0',
          companyAddressLongitude: '-93.0',
          recordedLatitude: '45.0',
          recordedLongitude: '-93.0',
          schedulingDate: '2023-01-01',
          endComment: 'Completed successfully',
          createdAt: '2023-01-01T09:00:00Z',
          updatedAt: '2023-01-01T10:00:00Z'
        }
      ];
      const paginationCore = new PaginationCoreEntity(1, 10);

      const result = OrderInfraMapper.toPaginationCoreEntity(entities, 1, paginationCore);

      expect(result).toBeInstanceOf(OrderPaginationCoreEntity);
      expect(result.items).toHaveLength(1);
      expect(result.totalHours.hours).toBe(0);
      expect(result.totalHours.minutes).toBe(0);
      expect(result.totalHours.seconds).toBe(0);
    });
  });

  describe('builderFindQuery', () => {
    it('should build a query object based on OrderQueryCoreEntity', () => {
      const queryCore = {
        employeeId: '123',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        status: OrderStatus.FINISHED,
        pagination: { page: 1, pageSize: 10 }
      };

      const result = OrderInfraMapper.builderFindQuery(queryCore);

      expect(result).toEqual(
        expect.objectContaining({
          where: expect.objectContaining({
            employeeId: '123',
            schedulingDate: expect.objectContaining({ $gte: '2023-01-01', $lte: '2023-01-31' }),
            status: OrderStatus.FINISHED
          })
        })
      );
    });
  });

  describe('builderAggregateQuery', () => {
    it('should build an aggregation query object', () => {
      const queryCore = {
        employeeId: '123',
        groupingPeriod: PeriodGroup.MONTHLY,
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        status: OrderStatus.FINISHED
      };

      const result = OrderInfraMapper.builderAggregateQuery(queryCore);

      expect(result).toHaveLength(5);
    });
  });
});
