import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
  exports: [NotesService],
})
export class NotesModule {}
