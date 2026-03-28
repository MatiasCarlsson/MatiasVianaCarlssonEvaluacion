import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ArchiveNoteDto {
  @ApiProperty({
    example: true,
    description: 'true para archivar, false para desarchivar',
  })
  @IsBoolean()
  isArchived: boolean;
}
