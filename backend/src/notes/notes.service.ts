import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async findAllActive() {
    return await this.notesRepository.findAll(false);
  }

  async findAllArchived() {
    return await this.notesRepository.findAll(true);
  }

  async findOne(id: string) {
    const note = await this.notesRepository.findById(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return note;
  }

  async findByCategory(categoryId: string) {
    return this.notesRepository.findByCategory(categoryId);
  }

  create(dto: CreateNoteDto) {
    return this.notesRepository.create(dto);
  }

  async update(id: string, dto: UpdateNoteDto) {
    const note = await this.findOne(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return this.notesRepository.update(id, dto);
  }

  async remove(id: string) {
    const note = await this.findOne(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return this.notesRepository.delete(id);
  }

  async setArchiveStatus(id: string, isArchived: boolean) {
    await this.findOne(id);
    return this.notesRepository.updateArchiveStatus(id, isArchived);
  }
}
