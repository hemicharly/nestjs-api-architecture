import { OrderStatus } from '@core/domain/enums';
import { OrderCoreEntity } from '@core/domain/entities/orders';
import { CustomBusinessException, CustomResourceNotFoundException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

/**
 * Represents the entity responsible for starting a work order, including attributes and validations related to the start process.
 */
export class OrderStartCoreEntity {
  /**
   * The start date and time of the order, recorded in ISO 8601 format.
   */
  startDatetime: string;

  /**
   * Latitude recorded at the start of the order.
   */
  recordedLatitude: string;

  /**
   * Longitude recorded at the start of the order.
   */
  recordedLongitude: string;

  /**
   * The status of the order, set to "IN_PROGRESS" when the entity is created.
   */
  readonly status: OrderStatus;

  /**
   * Creates a new instance of `OrderStartCoreEntity` to start an order.
   *
   * @param {string} id - The unique identifier of the order.
   * @param {string} employeeId - The unique identifier of the employee responsible for the order.
   */
  constructor(
    readonly id: string,
    readonly employeeId: string
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.status = OrderStatus.IN_PROGRESS;
  }

  /**
   * Validates whether an order can be started based on the provided entity.
   *
   * @param {OrderCoreEntity} entityCore - The entity representing the order to be validated.
   * @throws {CustomResourceNotFoundException} - Thrown if the order entity is not found.
   * @throws {CustomBusinessException} - Thrown if the order's status is not "OPEN".
   */
  public static validateOrderStart(entityCore: OrderCoreEntity): void {
    if (!entityCore) {
      throw new CustomResourceNotFoundException(CodeError.ORDER_NOT_FOUND);
    }

    if (entityCore.status !== OrderStatus.OPEN) {
      throw new CustomBusinessException(CodeError.ORDER_NOT_OPEN);
    }
  }
}
