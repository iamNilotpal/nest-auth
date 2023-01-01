import { IsNumber, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsNumber()
  @IsPositive()
  skip: number;
}
