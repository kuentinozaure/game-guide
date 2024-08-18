import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { GameGuideService } from './game-guide.service';

@Controller()
export class GameGuideController {
  constructor(private readonly gameGuideService: GameGuideService) {}

  @Get()
  async getGameGuideInfo(@Query() params: { prompt: string }): Promise<string> {
    return await this.gameGuideService.getGameGuideInfo(params.prompt);
  }

  @Post()
  async insertStaticGameManual(): Promise<string> {
    await this.gameGuideService.insertStaticGameManual();

    return 'Inserted static game manual';
  }

  @Delete()
  async deleteDocuments(): Promise<string> {
    await this.gameGuideService.deleteAllDocuments();

    return 'deleted all documents';
  }
}
