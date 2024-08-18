import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameDto } from 'src/dto/game.dto';
import { Game } from 'src/schema/game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  /**
   * Find all games
   * @returns {Game[]} all games
   */
  async find(): Promise<Game[]> {
    return await this.gameModel.find().exec();
  }

  /**
   * Create a new game
   * @param {GameDto} gameDto the game data from frontend
   * @returns {Game} the created game
   */
  async create(gameDto: GameDto): Promise<Game> {
    // Transform the DTO to a document
    const newGame = new this.gameModel({
      name: gameDto.name,
      price: gameDto.price,
      added: gameDto.added,
      rating: gameDto.rating,
      place: gameDto.place,
      lastPlay: gameDto.lastPlay,
    });

    return await newGame.save();
  }

  async delete(): Promise<void> {
    this.gameModel.deleteMany().exec();
  }
}
