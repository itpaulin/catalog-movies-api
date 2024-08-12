import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Movie, Prisma } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}
  private readonly apiKey: string = process.env.TMDB_API_KEY ?? '';

  async movie(
    movieWhereUniqueInput: Prisma.MovieWhereUniqueInput,
  ): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: movieWhereUniqueInput,
    });
  }

  async movies(params: {
    page?: number;
    limit?: number;
    cursor?: Prisma.MovieWhereUniqueInput;
    where?: Prisma.MovieWhereInput;
    orderBy?: Prisma.MovieOrderByWithRelationInput;
  }): Promise<Movie[]> {
    const { page = 1, limit = 10, cursor, orderBy, where } = params;

    return this.prisma.movie.findMany({
      skip: (page - 1) * limit,
      take: limit,
      cursor,
      where,
      orderBy,
    });
  }

  async countMovies(where?: Prisma.MovieWhereInput): Promise<number> {
    return this.prisma.movie.count({ where });
  }

  async createMovie(data: Prisma.MovieCreateInput): Promise<Movie> {
    const alreadyExists = await this.prisma.movie.findFirst({
      where: { id: data.id },
    });

    if (alreadyExists) {
      return this.prisma.movie.update({
        where: { id: data.id },
        data,
      });
    }
    return this.prisma.movie.create({
      data,
    });
  }

  async fetchMoviesFromAPI(): Promise<void> {
    this.prisma.movie.deleteMany({});
    const pageState = await this.prisma.indexState.findFirst({});

    //populando banco de dados com os filmes
    for (let i = pageState?.page ?? 1; i <= 20; i++) {
      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/popular',
        {
          params: {
            page: i,
          },
        },
      );

      const moviesTyped = response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        imagePath: movie.poster_path,
        releaseDate: new Date(movie.release_date),
      }));

      for (const movie of moviesTyped) {
        await this.createMovie(movie);
      }
    }
    this.prisma.indexState.upsert({
      where: { id: 1 },
      update: { page: 20 },
      create: { page: 20 },
    });
  }
}
