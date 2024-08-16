import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const data = await this.appService.getHello();

    return data.map((doc) => doc.pageContent).join('\n');
  }
}
