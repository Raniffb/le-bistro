import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateIngredientDto {
  @ApiPropertyOptional({ example: 'Arroz Arbóreo Premium' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'g' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  unit?: string;
}
