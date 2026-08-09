import { Controller, Get } from '@nestjs/common';
import { JsonFileService } from '../json-file/json-file.service';

@Controller('health')
export class HealthController {
  constructor(private readonly jsonFileService: JsonFileService) {}

  @Get()
  async check() {
    const db = await this.jsonFileService.read();
    return {
      status: 'ok',
      storage: 'json-file',
      notes: db.notes.length,
      categories: db.categories.length,
    };
  }
}
