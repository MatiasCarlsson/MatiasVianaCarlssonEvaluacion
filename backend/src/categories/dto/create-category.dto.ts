import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nombre de la categoría', example: 'Personal' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '#FF5733', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}
