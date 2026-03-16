import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateMenuItemStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  active!: boolean;
}
