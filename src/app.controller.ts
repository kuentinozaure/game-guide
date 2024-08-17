import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query() params: { prompt: string }): Promise<string> {
    return await this.appService.getHello(params.prompt);
  }

  @Post()
  async insertStaticGameManual(): Promise<string> {
    await this.appService.insertStaticGameManual();

    return 'Inserted static game manual';
  }

  @Delete()
  async deleteDocuments(): Promise<string> {
    await this.appService.deleteAllDocuments();

    return 'deleted all documents';
  }
}
