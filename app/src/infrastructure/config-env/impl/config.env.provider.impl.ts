import { ConfigEnvProviderInterface } from '@core/providers/config-env';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigEnvProviderImpl implements ConfigEnvProviderInterface {
  constructor(private readonly configService: ConfigService) {}

  public get<T = any>(key: string, defaultValue?: T): T {
    return this.configService.get(key, defaultValue);
  }

  public getString(key: string, defaultValue?: string): string {
    return this.configService.get<string>(key, defaultValue);
  }

  public getNumber(key: string, defaultValue?: number): number {
    return this.configService.get<number>(key, defaultValue);
  }

  public getBoolean(key: string, defaultValue?: boolean): boolean {
    return this.configService.get<boolean>(key, defaultValue);
  }
}
