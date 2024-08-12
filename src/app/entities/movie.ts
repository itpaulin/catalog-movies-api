export interface MovieProps {
  title: string;
  imagePath: string;
  releaseDate: Date;
  overview: string;
}

export class Movie {
  private props: MovieProps;

  constructor(props: MovieProps) {
    this.props = props;
  }

  public get title(): string {
    return this.props.title;
  }

  public set title(value: string) {
    this.props.title = value;
  }

  public get imagePath(): string {
    return this.props.imagePath;
  }

  public set imagePath(value: string) {
    this.props.imagePath = value;
  }

  public get releaseDate(): Date {
    return this.props.releaseDate;
  }

  public set releaseDate(value: Date) {
    this.props.releaseDate = value;
  }

  public get overview(): string {
    return this.props.overview;
  }

  public set overview(value: string) {
    this.props.overview = value;
  }
}
