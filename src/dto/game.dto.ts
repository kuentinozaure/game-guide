import { IsNotEmpty } from 'class-validator';

export class GameDto {
  @IsNotEmpty()
  name: string;

  price?: number;

  added?: string;

  rating?: number;

  place?: string;

  lastPlay?: string;
}
