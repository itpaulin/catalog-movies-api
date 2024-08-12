import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { MovieService } from 'src/app/movie.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { IndexStateService } from 'src/app/index-state.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService, IndexStateService],
})
export class HttpModule {}
