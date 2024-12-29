import { CustomBusinessException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

/**
 * A utility class for validating and processing geographical coordinates related to orders.
 * Includes methods to validate latitude, longitude, and calculate distances between geographical points.
 */
export class OrderCoordsCoreEntity {
  /**
   * Validates latitude and longitude coordinates.
   * Ensures that the latitude is between -90 and 90, and the longitude is between -180 and 180.
   *
   * @param {string} latitude - The latitude value to validate.
   * @param {string} longitude - The longitude value to validate.
   * @throws {CustomBusinessException} - Thrown if the latitude or longitude is invalid.
   */
  public static validateCoordinates(latitude: string, longitude: string): void {
    if (!(this.isValidLatitude(parseFloat(latitude)) && this.isValidLongitude(parseFloat(longitude)))) {
      throw new CustomBusinessException(CodeError.ORDER_INVALID_GEOLOCATION);
    }
  }

  /**
   * Validates the distance between two geographical points using the Haversine formula.
   * If the calculated distance exceeds 200 meters, an exception is thrown.
   *
   * @param {string} latitude1 - Latitude of the first point.
   * @param {string} longitude1 - Longitude of the first point.
   * @param {string} latitude2 - Latitude of the second point.
   * @param {string} longitude2 - Longitude of the second point.
   * @throws {CustomBusinessException} - Thrown if the distance between the points exceeds 200 meters.
   */
  public static validateDistance(latitude1: string, longitude1: string, latitude2: string, longitude2: string): void {
    const lat1 = parseFloat(latitude1);
    const lat2 = parseFloat(latitude2);
    const lon1 = parseFloat(longitude1);
    const lon2 = parseFloat(longitude2);

    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    if (distance > 0.2) {
      throw new CustomBusinessException(CodeError.ORDER_INVALID_GEOLOCATION_LOCAL);
    }
  }

  /**
   * Converts a value from degrees to radians.
   *
   * @param {number} degrees - The value in degrees to convert.
   * @returns {number} - The equivalent value in radians.
   */
  private static degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Checks if a latitude value is valid.
   * A valid latitude is a number between -90 and 90.
   *
   * @param {number} lat - The latitude value to validate.
   * @returns {boolean} - `true` if the latitude is valid, otherwise `false`.
   */
  private static isValidLatitude(lat: number): boolean {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  }

  /**
   * Checks if a longitude value is valid.
   * A valid longitude is a number between -180 and 180.
   *
   * @param {number} lon - The longitude value to validate.
   * @returns {boolean} - `true` if the longitude is valid, otherwise `false`.
   */
  private static isValidLongitude(lon: number): boolean {
    return !isNaN(lon) && lon >= -180 && lon <= 180;
  }
}
