import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonFileService } from '../json-file/json-file.service';
import {
  Database,
  JsonNote,
  NoteCategory,
  NoteWithCategories,
} from '../json-file/types';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly jsonFileService: JsonFileService) {}

  private enrichNote(note: JsonNote, db: Database): NoteWithCategories {
    const noteCategories: NoteCategory[] = db.note_categories
      .filter((nc) => nc.noteId === note.id)
      .map((nc) => {
        const category = db.categories.find((c) => c.id === nc.categoryId);
        return category
          ? {
              noteId: nc.noteId,
              categoryId: nc.categoryId,
              categories: category,
            }
          : null;
      })
      .filter((nc): nc is NoteCategory => nc !== null);

    return { ...note, note_categories: noteCategories };
  }

  async findAll(isArchived: boolean, options: PageOptionsDto) {
    const db = await this.jsonFileService.read();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q?.trim().toLowerCase() ?? '';

    let filtered = db.notes.filter((n) => n.isArchived === isArchived);
    if (q) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      );
    }
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = filtered.length;
    const data = filtered
      .slice((page - 1) * limit, page * limit)
      .map((note) => this.enrichNote(note, db));

    return { data, total };
  }

  async findById(id: string): Promise<NoteWithCategories | null> {
    const db = await this.jsonFileService.read();
    const note = db.notes.find((n) => n.id === id);
    if (!note) return null;
    return this.enrichNote(note, db);
  }

  async findByCategory(categoryId: string, options: PageOptionsDto) {
    const db = await this.jsonFileService.read();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q?.trim().toLowerCase() ?? '';

    const noteIds = new Set(
      db.note_categories
        .filter((nc) => nc.categoryId === categoryId)
        .map((nc) => nc.noteId),
    );

    let filtered = db.notes.filter((n) => !n.isArchived && noteIds.has(n.id));
    if (q) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      );
    }
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = filtered.length;
    const data = filtered
      .slice((page - 1) * limit, page * limit)
      .map((note) => this.enrichNote(note, db));

    return { data, total };
  }

  create(data: CreateNoteDto): Promise<NoteWithCategories> {
    return this.jsonFileService.mutate((db) => {
      const now = new Date().toISOString();
      const newNote: JsonNote = {
        id: randomUUID(),
        title: data.title,
        content: data.content,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      };
      db.notes.push(newNote);
      return this.enrichNote(newNote, db);
    });
  }

  update(id: string, data: UpdateNoteDto): Promise<NoteWithCategories> {
    return this.jsonFileService.mutate((db) => {
      const note = db.notes.find((n) => n.id === id);
      if (!note) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      if (data.title !== undefined) note.title = data.title;
      if (data.content !== undefined) note.content = data.content;
      note.updatedAt = new Date().toISOString();
      return this.enrichNote(note, db);
    });
  }

  delete(id: string): Promise<JsonNote> {
    return this.jsonFileService.mutate((db) => {
      const index = db.notes.findIndex((n) => n.id === id);
      if (index === -1) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      const [deleted] = db.notes.splice(index, 1);
      db.note_categories = db.note_categories.filter((nc) => nc.noteId !== id);
      return deleted;
    });
  }

  updateArchiveStatus(
    id: string,
    isArchived: boolean,
  ): Promise<NoteWithCategories> {
    return this.jsonFileService.mutate((db) => {
      const note = db.notes.find((n) => n.id === id);
      if (!note) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      note.isArchived = isArchived;
      note.updatedAt = new Date().toISOString();
      return this.enrichNote(note, db);
    });
  }
}
