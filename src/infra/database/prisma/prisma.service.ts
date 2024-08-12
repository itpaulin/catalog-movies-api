import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    try {
      await this.indexState.update({
        where: { id: 1 },
        data: { page: 1 },
      });

      await this.movie.deleteMany({});
    } catch (error) {
      console.error('Erro ao atualizar o indexState ou deletar filmes:', error);
    }
  }
}
