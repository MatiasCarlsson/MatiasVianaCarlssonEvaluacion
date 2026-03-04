import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Mi nota', description: 'Título de la nota' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Contenido de la nota',
    description: 'Contenido de la nota',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
