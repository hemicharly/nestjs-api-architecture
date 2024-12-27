import { OrderCoreEntity } from '@core/domain/entities/orders/order-core.entity';

export class OrderTotalHoursCoreEntity {
  hours: number;
  minutes: number;
  seconds: number;

  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  /**
   * Calcula a diferença de tempo entre duas datas e retorna uma nova instância de OrderTotalHoursCoreEntity
   * contendo a diferença em horas, minutos e segundos.
   *
   * @param {string} startDatetime - A data/hora de início no formato ISO 8601.
   * @param {string} endDatetime - A data/hora de término no formato ISO 8601.
   * @returns {OrderTotalHoursCoreEntity} - Uma instância contendo a diferença de tempo em horas, minutos e segundos.
   */
  public static calculate(startDatetime: string, endDatetime: string): OrderTotalHoursCoreEntity {
    const entity = new OrderTotalHoursCoreEntity();
    if (!startDatetime || !endDatetime) {
      return entity;
    }

    const start = new Date(startDatetime);
    const end = new Date(endDatetime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }

    const diffSeconds = OrderTotalHoursCoreEntity.calculateSecondsDiff(start, end);
    return OrderTotalHoursCoreEntity.secondsToHoursMinutesSeconds(diffSeconds);
  }

  /**
   * Calcula o total de horas, minutos e segundos a partir de uma lista de entidades OrderCoreEntity.
   *
   * @param {OrderCoreEntity[]} items - Uma lista de instâncias de OrderCoreEntity.
   * @returns {OrderTotalHoursCoreEntity} - Uma instância contendo o tempo total acumulado em horas, minutos e segundos.
   */
  public static calculateTotal(items: OrderCoreEntity[]): OrderTotalHoursCoreEntity {
    if (!items || items.length === 0) {
      return new OrderTotalHoursCoreEntity();
    }

    const totalSeconds = items.reduce((acc, item) => acc + item.totalHours.hours * 3600 + item.totalHours.minutes * 60 + item.totalHours.seconds, 0);

    return OrderTotalHoursCoreEntity.secondsToHoursMinutesSeconds(totalSeconds);
  }

  /**
   * Calcula a diferença em segundos entre duas datas.
   *
   * @param {Date} start - Data de início.
   * @param {Date} end - Data de término.
   * @returns {number} - Diferença em segundos.
   */
  private static calculateSecondsDiff(start: Date, end: Date): number {
    return Math.floor((end.getTime() - start.getTime()) / 1000);
  }

  /**
   * Converte segundos em uma instância de OrderTotalHoursCoreEntity contendo horas, minutos e segundos.
   *
   * @param {number} totalSeconds - O total de segundos a ser convertido.
   * @returns {OrderTotalHoursCoreEntity} - Uma instância contendo horas, minutos e segundos.
   */
  private static secondsToHoursMinutesSeconds(totalSeconds: number): OrderTotalHoursCoreEntity {
    const entity = new OrderTotalHoursCoreEntity();
    entity.hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    entity.minutes = Math.floor(totalSeconds / 60);
    entity.seconds = totalSeconds % 60;
    return entity;
  }
}
