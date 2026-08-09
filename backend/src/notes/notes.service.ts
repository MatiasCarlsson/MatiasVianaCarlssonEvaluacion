import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  PageOptionsDto,
  PaginatedResult,
} from '../common/dto/page-options.dto';
import { NoteWithCategories } from '../json-file/types';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async invalidateCache() {
    try {
      if (typeof (this.cacheManager as any).clear === 'function') {
        await (this.cacheManager as any).clear();
      } else if (typeof (this.cacheManager as any).reset === 'function') {
        await (this.cacheManager as any).reset();
      }
    } catch {
      // ignore
    }
  }

  async findAllActive(
    options: PageOptionsDto,
  ): Promise<PaginatedResult<NoteWithCategories>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q ?? '';
    const cacheKey = `notes:active:${page}:${limit}:${q}`;

    const cached =
      await this.cacheManager.get<PaginatedResult<NoteWithCategories>>(
        cacheKey,
      );
    if (cached) return cached;

    const { data, total } = await this.notesRepository.findAll(false, options);
    const result = {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async findAllArchived(
    options: PageOptionsDto,
  ): Promise<PaginatedResult<NoteWithCategories>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q ?? '';
    const cacheKey = `notes:archived:${page}:${limit}:${q}`;

    const cached =
      await this.cacheManager.get<PaginatedResult<NoteWithCategories>>(
        cacheKey,
      );
    if (cached) return cached;

    const { data, total } = await this.notesRepository.findAll(true, options);
    const result = {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `notes:id:${id}`;
    const cached = await this.cacheManager.get<NoteWithCategories>(cacheKey);
    if (cached) return cached;

    const note = await this.notesRepository.findById(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);

    await this.cacheManager.set(cacheKey, note, 300000);
    return note;
  }

  async findByCategory(
    categoryId: string,
    options: PageOptionsDto,
  ): Promise<PaginatedResult<NoteWithCategories>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q ?? '';
    const cacheKey = `notes:cat:${categoryId}:${page}:${limit}:${q}`;

    const cached =
      await this.cacheManager.get<PaginatedResult<NoteWithCategories>>(
        cacheKey,
      );
    if (cached) return cached;

    const { data, total } = await this.notesRepository.findByCategory(
      categoryId,
      options,
    );
    const result = {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async create(dto: CreateNoteDto) {
    const result = await this.notesRepository.create(dto);
    await this.invalidateCache();
    return result;
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOne(id);
    const result = await this.notesRepository.update(id, dto);
    await this.invalidateCache();
    return result;
  }

  async remove(id: string) {
    const note = await this.findOne(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    const result = await this.notesRepository.delete(id);
    await this.invalidateCache();
    return result;
  }

  async setArchiveStatus(id: string, isArchived: boolean) {
    await this.findOne(id);
    const result = await this.notesRepository.updateArchiveStatus(
      id,
      isArchived,
    );
    await this.invalidateCache();
    return result;
  }
}
