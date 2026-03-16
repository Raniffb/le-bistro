import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateIngredientStockDto {
  @ApiProperty({ example: 3500 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity!: number;
}
