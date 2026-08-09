import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { JsonFileModule } from './json-file/json-file.module';
import { NotesModule } from './notes/notes.module';
import { CategoriesModule } from './categories/categories.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutos de cache
      max: 500,
    }),
    JsonFileModule,
    NotesModule,
    CategoriesModule,
    HealthModule,
  ],
})
export class AppModule {}
