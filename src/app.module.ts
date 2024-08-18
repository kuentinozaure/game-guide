import { Module } from '@nestjs/common';
import { GameGuideController } from './game-guide.controller';
import { GameGuideService } from './game-guide.service';
import { ConfigModule } from '@nestjs/config';
import { PineconeLoader } from './loader/pinecone.loader';
import { GameGuideRepository } from './game-guide.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GameGuideController],
  providers: [GameGuideService, GameGuideRepository, PineconeLoader],
})
export class AppModule {}
