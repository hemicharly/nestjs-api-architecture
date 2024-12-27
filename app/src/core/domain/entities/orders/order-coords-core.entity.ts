import { CustomBusinessException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

export class OrderCoordsCoreEntity {
  /**
   * Valida as coordenadas de latitude e longitude.
   * Lança uma exceção se a latitude ou longitude forem inválidas.
   * @param latitude Latitude a ser validada.
   * @param longitude Longitude a ser validada.
   * @throws CustomBusinessException Exceção lançada se a latitude ou longitude forem inválidas.
   */
  public static validateCoordinates(latitude: string, longitude: string): void {
    if (!(this.isValidLatitude(parseFloat(latitude)) && this.isValidLongitude(parseFloat(longitude)))) {
      throw new CustomBusinessException(CodeError.ORDER_INVALID_GEOLOCATION);
    }
  }

  /**
   * Calcula a distância entre dois pontos geográficos utilizando a fórmula de Haversine.
   * Se a distância entre os pontos for maior que 200 metros, lança uma exceção.
   * @param latitude1 Latitude do primeiro ponto.
   * @param longitude1 Longitude do primeiro ponto.
   * @param latitude2 Latitude do segundo ponto.
   * @param longitude2 Longitude do segundo ponto.
   * @throws CustomBusinessException Exceção lançada se a distância entre os pontos for maior que 200 metros.
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

  private static degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  private static isValidLatitude(lat: number): boolean {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  }

  private static isValidLongitude(lon: number): boolean {
    return !isNaN(lon) && lon >= -180 && lon <= 180;
  }
}
