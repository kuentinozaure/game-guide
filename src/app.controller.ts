import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query() params: { prompt: string }): Promise<string> {
    const data = await this.appService.getHello(params.prompt);
    return data.map((doc) => doc.pageContent).join('\n');
  }

  @Post()
  async insertStaticGameManual(): Promise<string> {
    await this.appService.insertStaticGameManual();

    return 'Inserted static game manual';
  }
}
