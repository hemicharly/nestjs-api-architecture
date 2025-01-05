import { CustomBusinessException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';
import { OrderCoordsCoreEntity } from '@core/domain/entities/orders';

/**
 * Implementation of test to 'order-coords-core.entity.ts'
 */
describe('order-coords-core.entity.ts', () => {
  describe('validateCoordinates', () => {
    it('should not throw an exception for valid latitude and longitude', () => {
      expect(() => OrderCoordsCoreEntity.validateCoordinates('45.0', '90.0')).not.toThrow();
    });

    it('should throw an exception for invalid latitude', () => {
      expect(() => OrderCoordsCoreEntity.validateCoordinates('100.0', '90.0')).toThrowError(
        CustomBusinessException
      );
      expect(() => OrderCoordsCoreEntity.validateCoordinates('100.0', '90.0')).toThrowError(
        CodeError.ORDER_INVALID_GEOLOCATION.message
      );
    });

    it('should throw an exception for invalid longitude', () => {
      expect(() => OrderCoordsCoreEntity.validateCoordinates('45.0', '200.0')).toThrowError(
        CustomBusinessException
      );
      expect(() => OrderCoordsCoreEntity.validateCoordinates('45.0', '200.0')).toThrowError(
        CodeError.ORDER_INVALID_GEOLOCATION.message
      );
    });

    it('should throw an exception for invalid latitude and longitude', () => {
      expect(() => OrderCoordsCoreEntity.validateCoordinates('100.0', '200.0')).toThrowError(
        CustomBusinessException
      );
      expect(() => OrderCoordsCoreEntity.validateCoordinates('100.0', '200.0')).toThrowError(
        CodeError.ORDER_INVALID_GEOLOCATION.message
      );
    });
  });

  describe('validateDistance', () => {
    it('should not throw an exception for points within 200 meters', () => {
      expect(() =>
        OrderCoordsCoreEntity.validateDistance('45.0', '90.0', '45.0001', '90.0001')
      ).not.toThrow();
    });

    it('should throw an exception for points farther than 200 meters', () => {
      expect(() =>
        OrderCoordsCoreEntity.validateDistance('45.0', '90.0', '46.0', '91.0')
      ).toThrowError(CustomBusinessException);
      expect(() =>
        OrderCoordsCoreEntity.validateDistance('45.0', '90.0', '46.0', '91.0')
      ).toThrowError(CodeError.ORDER_INVALID_GEOLOCATION_LOCAL.message);
    });
  });

  describe('private utility methods', () => {
    it('should correctly convert degrees to radians', () => {
      const degrees = 180;
      const radians = (degrees * Math.PI) / 180;
      expect(OrderCoordsCoreEntity['degreesToRadians'](degrees)).toBeCloseTo(radians);
    });
  });
});
