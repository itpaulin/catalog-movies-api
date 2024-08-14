import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Movie, Prisma } from '@prisma/client';
import { IndexStateService } from './index-state.service';
import axios from 'axios';

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    private indexStateService: IndexStateService,
  ) {}
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

  async createManyMovies(data: Prisma.MovieCreateManyInput[]): Promise<void> {
    for (const movieData of data) {
      await this.prisma.movie.upsert({
        where: { id: movieData.id },
        update: movieData,
        create: movieData,
      });
    }
  }

  async fetchMoviesFromAPI(): Promise<void> {
    await this.prisma.movie.deleteMany({});

    const quantityRequests = 5;
    const pageState = await this.indexStateService.indexState();
    if (!pageState) return;

    const newMovies: Prisma.MovieCreateManyInput[] = [];

    for (let index = 0; index <= quantityRequests; index++) {
      await axios
        .get('https://api.themoviedb.org/3/movie/popular', {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          params: {
            language: 'pt-BR',
            page: pageState + index,
          },
        })
        .then((response) => {
          response.data.results.map((movie: any) => {
            const releaseDate = new Date(movie.release_date);

            if (isNaN(releaseDate.getTime())) {
              console.warn(`Data inválida para o filme: ${movie.title}.`);
              return;
            }
            if (!movie.poster_path || !movie.overview) return;

            newMovies.push({
              id: movie.id,
              title: movie.title,
              imagePath: movie.poster_path,
              overview: movie.overview,
              releaseDate: releaseDate,
            });
          });
        })
        .catch((error) => console.log(error));
    }

    await this.createManyMovies(newMovies);

    await this.indexStateService.updateIndexState(pageState + quantityRequests);
  }
}
