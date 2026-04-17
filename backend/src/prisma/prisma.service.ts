import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        if (attempt > 1) {
          this.logger.log(
            `Prisma conectado en el intento ${attempt}/${maxAttempts}.`,
          );
        }
        return;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const isLastAttempt = attempt === maxAttempts;

        if (isLastAttempt) {
          this.logger.error(
            [
              `No se pudo conectar a la base de datos tras ${maxAttempts} intentos.`,
              'Verifica DATABASE_URL/DIRECT_URL y usa sslmode=require con Supabase.',
              `Error original: ${errorMessage}`,
            ].join(' '),
          );
          throw error;
        }

        this.logger.warn(
          `Intento ${attempt}/${maxAttempts} de conexión Prisma falló. Reintentando en 2s...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
