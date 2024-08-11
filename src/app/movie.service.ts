import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Movie, Prisma } from '@prisma/client';
import axios from 'axios';

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
    return this.prisma.movie.create({
      data,
    });
  }

  async deleteAllMovies(): Promise<void> {
    await this.prisma.movie.deleteMany();
  }

  async fetchMoviesFromAPI(): Promise<Movie[]> {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          language: 'pt-BR',
          page: 2,
        },
      },
    );

    return response.data.results.map((movie: any) => ({
      title: movie.title,
      overview: movie.overview,
      imagePath: movie.poster_path,
      releaseDate: new Date(movie.release_date),
    }));
  }
}
