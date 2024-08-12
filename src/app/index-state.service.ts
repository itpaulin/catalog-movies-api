import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class IndexStateService {
  constructor(private prisma: PrismaService) {}

  async indexState(): Promise<number> {
    const indexObject = await this.prisma.indexState.findFirst({
      where: { id: 1 },
    });
    if (!indexObject) return 1;
    return indexObject.page;
  }

  async updateIndexState(page: number): Promise<void> {
    await this.prisma.indexState.update({
      where: { id: 1 },
      data: { page },
    });
  }
}
