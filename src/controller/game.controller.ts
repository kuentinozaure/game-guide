import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { GameDto } from '../dto/game.dto';
import { Game } from '../schema/game.schema';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames(): Promise<Game[]> {
    return await this.gameService.find();
  }

  @Post()
  async createGame(@Body() game: GameDto): Promise<Game> {
    return await this.gameService.create(game);
  }

  @Delete()
  async deleteGame(): Promise<void> {
    return await this.gameService.delete();
  }
}
