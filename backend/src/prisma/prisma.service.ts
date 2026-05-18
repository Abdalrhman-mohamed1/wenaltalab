import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    // In a real environment, this connects to the database.
    // We wrap it in a try-catch so it doesn't crash the server if DB is unavailable during development
    try {
      await this.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.warn('Database connection failed - Make sure PostgreSQL is running.', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
