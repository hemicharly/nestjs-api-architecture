import { OrderCoreEntity } from '@core/domain/entities/orders';

/**
 * Represents an entity that calculates and stores the total time difference between two dates
 * or the total accumulated time from a list of OrderCoreEntity instances in hours, minutes, and seconds.
 * Provides methods to calculate time differences, as well as aggregate time from multiple order entities.
 */
export class OrderTotalHoursCoreEntity {
  /**
   * The total number of hours in the time difference or accumulated time.
   * Initialized to 0 by default.
   */
  hours: number;

  /**
   * The total number of minutes in the time difference or accumulated time.
   * Initialized to 0 by default.
   */
  minutes: number;

  /**
   * The total number of seconds in the time difference or accumulated time.
   * Initialized to 0 by default.
   */
  seconds: number;

  /**
   * Initializes the OrderTotalHoursCoreEntity instance with default values (0 hours, 0 minutes, and 0 seconds).
   */
  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  /**
   * Calculates the time difference between two dates and returns a new instance of OrderTotalHoursCoreEntity
   * containing the difference in hours, minutes, and seconds.
   *
   * @param {string} startDatetime - The start date/time in ISO 8601 format (e.g., '2024-12-29T08:00:00Z').
   * @param {string} endDatetime - The end date/time in ISO 8601 format (e.g., '2024-12-29T12:45:30Z').
   * @returns {OrderTotalHoursCoreEntity} - An instance containing the time difference in hours, minutes, and seconds.
   * @throws {Error} - Throws an error if the date format is invalid.
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
   * Calculates the total hours, minutes, and seconds from a list of OrderCoreEntity instances.
   * It aggregates the total time across all items in the list.
   *
   * @param {OrderCoreEntity[]} items - A list of OrderCoreEntity instances, each containing a 'totalHours' field.
   * @returns {OrderTotalHoursCoreEntity} - An instance containing the total accumulated time in hours, minutes, and seconds.
   */
  public static calculateTotal(items: OrderCoreEntity[]): OrderTotalHoursCoreEntity {
    if (!items || items.length === 0) {
      return new OrderTotalHoursCoreEntity();
    }

    const totalSeconds = items.reduce(
      (acc, item) =>
        acc + item.totalHours.hours * 3600 + item.totalHours.minutes * 60 + item.totalHours.seconds,
      0
    );

    return OrderTotalHoursCoreEntity.secondsToHoursMinutesSeconds(totalSeconds);
  }

  /**
   * Calculates the difference in seconds between two dates.
   * This is a helper method used by `calculate` to determine the total time difference.
   *
   * @param {Date} start - The start date.
   * @param {Date} end - The end date.
   * @returns {number} - The difference in seconds.
   */
  private static calculateSecondsDiff(start: Date, end: Date): number {
    return Math.floor((end.getTime() - start.getTime()) / 1000);
  }

  /**
   * Converts a total number of seconds into an instance of OrderTotalHoursCoreEntity containing hours, minutes, and seconds.
   *
   * @param {number} totalSeconds - The total number of seconds to convert.
   * @returns {OrderTotalHoursCoreEntity} - An instance containing the converted hours, minutes, and seconds.
   * @throws {Error} - Throws an error if the totalSeconds is negative or not a valid number.
   */
  private static secondsToHoursMinutesSeconds(totalSeconds: number): OrderTotalHoursCoreEntity {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      throw new Error('Invalid totalSeconds value. It must be a non-negative number.');
    }

    const hours = Math.floor(totalSeconds / 3600); // Calculate full hours
    const remainingSecondsAfterHours = totalSeconds % 3600; // Remaining seconds after hours
    const minutes = Math.floor(remainingSecondsAfterHours / 60); // Calculate full minutes
    const seconds = remainingSecondsAfterHours % 60; // Remaining seconds after minutes

    const entity = new OrderTotalHoursCoreEntity();
    entity.hours = hours;
    entity.minutes = minutes;
    entity.seconds = seconds;
    return entity;
  }
}
