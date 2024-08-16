import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { DocumentInterface } from '@langchain/core/documents';

@Injectable()
export class AppService {
  constructor(private readonly appRepo: AppRepository) {}

  async getHello(): Promise<DocumentInterface<Record<string, any>>[]> {
    const data = await this.appRepo.requestPineconeData('Sport');
    return data;
  }
}
