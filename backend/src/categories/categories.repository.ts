import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonFileService } from '../json-file/json-file.service';
import { JsonCategory } from '../json-file/types';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly jsonFileService: JsonFileService) {}

  async findAll(options: PageOptionsDto) {
    const db = await this.jsonFileService.read();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q?.trim().toLowerCase() ?? '';

    let filtered = db.categories;
    if (q) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
    }
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    const total = filtered.length;
    const data = filtered.slice((page - 1) * limit, page * limit);

    return { data, total };
  }

  async findById(id: string): Promise<JsonCategory | null> {
    const db = await this.jsonFileService.read();
    return db.categories.find((c) => c.id === id) ?? null;
  }

  async findByNote(noteId: string): Promise<JsonCategory[]> {
    const db = await this.jsonFileService.read();
    const categoryIds = new Set(
      db.note_categories
        .filter((nc) => nc.noteId === noteId)
        .map((nc) => nc.categoryId),
    );
    return db.categories.filter((c) => categoryIds.has(c.id));
  }

  addCategoryToNote(noteId: string, categoryId: string) {
    return this.jsonFileService.mutate((db) => {
      const exists = db.note_categories.some(
        (nc) => nc.noteId === noteId && nc.categoryId === categoryId,
      );
      if (!exists) {
        db.note_categories.push({ noteId, categoryId });
      }
      return { noteId, categoryId };
    });
  }

  removeCategoryFromNote(noteId: string, categoryId: string) {
    return this.jsonFileService.mutate((db) => {
      db.note_categories = db.note_categories.filter(
        (nc) => !(nc.noteId === noteId && nc.categoryId === categoryId),
      );
      return { noteId, categoryId };
    });
  }

  create(data: { name: string; color?: string }): Promise<JsonCategory> {
    return this.jsonFileService.mutate((db) => {
      const category: JsonCategory = {
        id: randomUUID(),
        name: data.name,
        color: data.color ?? null,
        createdAt: new Date().toISOString(),
      };
      db.categories.push(category);
      return category;
    });
  }

  update(id: string, data: UpdateCategoryDto): Promise<JsonCategory> {
    return this.jsonFileService.mutate((db) => {
      const category = db.categories.find((c) => c.id === id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      if (data.name !== undefined) category.name = data.name;
      if (data.color !== undefined) category.color = data.color;
      return category;
    });
  }

  delete(id: string): Promise<JsonCategory> {
    return this.jsonFileService.mutate((db) => {
      const index = db.categories.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      const [deleted] = db.categories.splice(index, 1);
      db.note_categories = db.note_categories.filter(
        (nc) => nc.categoryId !== id,
      );
      return deleted;
    });
  }
}
