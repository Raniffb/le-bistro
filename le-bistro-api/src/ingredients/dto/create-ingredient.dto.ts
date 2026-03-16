import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Arroz Arbóreo' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'g' })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiProperty({ example: 5000, required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity?: number;
}
