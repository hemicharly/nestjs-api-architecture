import { ApiProperty } from '@nestjs/swagger';

export class OrderTotalHoursResponse {
  @ApiProperty({ description: 'Order total hours.' })
  hours: number;

  @ApiProperty({ description: 'Order total minutes.' })
  minutes: number;

  @ApiProperty({ description: 'Order total seconds.' })
  seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours || 0;
    this.minutes = minutes || 0;
    this.seconds = seconds || 0;
  }
}
