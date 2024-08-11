import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Movie, Prisma } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async movie(
    movieWhereUniqueInput: Prisma.MovieWhereUniqueInput,
  ): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: movieWhereUniqueInput,
    });
  }

  async movies(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MovieWhereUniqueInput;
    where?: Prisma.MovieWhereInput;
    orderBy?: Prisma.MovieOrderByWithRelationInput;
  }): Promise<Movie[]> {
    const { cursor, orderBy, skip, take, where } = params;
    return this.prisma.movie.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createMovie(data: Prisma.MovieCreateInput): Promise<Movie> {
    return this.prisma.movie.create({
      data,
    });
  }

  async deleteAllMovies(): Promise<void> {
    await this.prisma.movie.deleteMany();
  }
}
