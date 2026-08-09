import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JsonCategory } from '../json-file/types';
import {
  PageOptionsDto,
  PaginatedResult,
} from '../common/dto/page-options.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
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

  async findAllCategories(
    options: PageOptionsDto,
  ): Promise<PaginatedResult<JsonCategory>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const q = options.q ?? '';
    const cacheKey = `categories:all:${page}:${limit}:${q}`;

    const cached =
      await this.cacheManager.get<PaginatedResult<JsonCategory>>(cacheKey);
    if (cached) return cached;

    const { data, total } = await this.categoriesRepository.findAll(options);
    const result = {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `categories:id:${id}`;
    const cached = await this.cacheManager.get<JsonCategory>(cacheKey);
    if (cached) return cached;

    const category = await this.categoriesRepository.findById(id);
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    await this.cacheManager.set(cacheKey, category, 300000);
    return category;
  }

  async findByNote(noteId: string) {
    const cacheKey = `categories:note:${noteId}`;
    const cached = await this.cacheManager.get<JsonCategory[]>(cacheKey);
    if (cached) return cached;

    const result = await this.categoriesRepository.findByNote(noteId);
    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async addCategoryToNote(noteId: string, categoryId: string) {
    const result = await this.categoriesRepository.addCategoryToNote(
      noteId,
      categoryId,
    );
    await this.invalidateCache();
    return result;
  }

  async removeCategoryFromNote(noteId: string, categoryId: string) {
    const result = await this.categoriesRepository.removeCategoryFromNote(
      noteId,
      categoryId,
    );
    await this.invalidateCache();
    return result;
  }

  async create(data: CreateCategoryDto): Promise<JsonCategory> {
    const result = await this.categoriesRepository.create({
      name: data.name,
      ...(data.color !== undefined && { color: data.color }),
    });
    await this.invalidateCache();
    return result;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    const result = await this.categoriesRepository.update(id, dto);
    await this.invalidateCache();
    return result;
  }

  async removeCategory(id: string) {
    await this.findOne(id);
    const result = await this.categoriesRepository.delete(id);
    await this.invalidateCache();
    return result;
  }
}
