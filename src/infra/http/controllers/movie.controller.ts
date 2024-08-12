import { Body, Controller, Get, Query } from '@nestjs/common';
import { MovieService } from '../../../app/movie.service';
import { Movie, Movie as MovieModel } from '@prisma/client';
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getMovies(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ data: Movie[]; total: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const movies = await this.movieService.movies({
      page: pageNumber,
      limit: limitNumber,
      orderBy: { releaseDate: 'desc' },
    });
    const total = await this.movieService.countMovies();

    return {
      data: movies,
      total,
    };
  }

  @Get('renew')
  async reindexar(): Promise<string> {
    await this.movieService.fetchMoviesFromAPI();
    return 'Reindexação iniciada';
  }
}
