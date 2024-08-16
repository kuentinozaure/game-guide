import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppRepository } from './app.repository';
import { PineconeLoader } from './loader/pinecone.loader';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AppRepository, PineconeLoader],
})
export class AppModule {}
