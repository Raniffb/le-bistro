import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class MenuItemRecipeIngredientDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ingredientId!: number;

  @ApiProperty({ example: 150 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantityRequired!: number;
}

export class UpdateMenuItemRecipeDto {
  @ApiProperty({
    type: [MenuItemRecipeIngredientDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MenuItemRecipeIngredientDto)
  ingredients!: MenuItemRecipeIngredientDto[];
}
