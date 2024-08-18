import { Module } from '@nestjs/common';
import { GameGuideController } from './controller/game-guide.controller';
import { GameGuideService } from './service/game-guide.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PineconeLoader } from './loader/pinecone.loader';
import { GameGuideRepository } from './repository/game-guide.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schema/game.schema';
import { GameController } from './controller/game.controller';
import { GameService } from './service/game.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameGuideController, GameController],
  providers: [
    GameGuideService,
    GameService,
    GameGuideRepository,
    PineconeLoader,
  ],
})
export class AppModule {}
