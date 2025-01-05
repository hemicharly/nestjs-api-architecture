import { OrderStatus } from '@core/domain/enums';
import { OrderCoreEntity } from '@core/domain/entities/orders';

export class OrderCreationCoreEntity {
  serviceDescription: string;
  companyName: string;
  companyAddressLatitude: string;
  companyAddressLongitude: string;
  schedulingDate: string;
  readonly status: OrderStatus;

  constructor(readonly employeeId: string) {
    this.employeeId = employeeId;
    this.status = OrderStatus.OPEN;
  }

  public static toOrderCoreEntity(entityCore: OrderCreationCoreEntity): Partial<OrderCoreEntity> {
    return {
      employeeId: entityCore.employeeId,
      serviceDescription: entityCore.serviceDescription,
      companyName: entityCore.companyName,
      companyAddressLatitude: entityCore.companyAddressLatitude,
      companyAddressLongitude: entityCore.companyAddressLongitude,
      schedulingDate: entityCore.schedulingDate,
      status: entityCore.status
    };
  }
}
