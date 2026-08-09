import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Database, emptyDatabase } from './types';

@Injectable()
export class JsonFileService implements OnModuleInit {
  private readonly logger = new Logger(JsonFileService.name);
  private readonly filePath: string;
  private locked = false;
  private queue: Array<() => void> = [];

  constructor() {
    const envPath = process.env.JSON_DB_PATH;
    this.filePath = envPath
      ? path.resolve(envPath)
      : path.join(process.cwd(), 'data', 'data.json');
  }

  async onModuleInit() {
    await this.ensureFile();
    this.logger.log(`Persistencia JSON local en ${this.filePath}`);
  }

  private async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }

  private async ensureFile(): Promise<void> {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(
        this.filePath,
        JSON.stringify(emptyDatabase(), null, 2),
        'utf-8',
      );
    }
  }

  private async readUnlocked(): Promise<Database> {
    await this.ensureFile();
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<Database> | null;
      return {
        notes: Array.isArray(parsed?.notes) ? parsed.notes : [],
        categories: Array.isArray(parsed?.categories) ? parsed.categories : [],
        note_categories: Array.isArray(parsed?.note_categories)
          ? parsed.note_categories
          : [],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `No se pudo leer el JSON (${message}). Usando estructura vacía.`,
      );
      return emptyDatabase();
    }
  }

  private async writeUnlocked(db: Database): Promise<void> {
    await this.ensureFile();
    const tmpPath = `${this.filePath}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(db, null, 2), 'utf-8');
    await fs.rename(tmpPath, this.filePath);
  }

  async read(): Promise<Database> {
    await this.acquire();
    try {
      return await this.readUnlocked();
    } finally {
      this.release();
    }
  }

  async mutate<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
    await this.acquire();
    try {
      const db = await this.readUnlocked();
      const result = await fn(db);
      await this.writeUnlocked(db);
      return result;
    } finally {
      this.release();
    }
  }
}
