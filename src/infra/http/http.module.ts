import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { MovieService } from 'src/app/movie.service';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService],
})
export class HttpModule {}
