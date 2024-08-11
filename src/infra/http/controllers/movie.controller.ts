import { Body, Controller, Get } from '@nestjs/common';
import { MovieService } from '../../../app/movie.service';
import { Movie as MovieModel } from '@prisma/client';
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getMovies(): Promise<MovieModel[]> {
    const movies = await this.movieService.movies({});

    const sortedMovies = movies.sort((a, b) =>
      a.releaseDate > b.releaseDate ? 1 : -1,
    );

    return sortedMovies;
  }

  @Get('update')
  async updateListMovies(): Promise<MovieModel[]> {
    await this.movieService.deleteAllMovies();
    return this.getMovies();
  }
}
