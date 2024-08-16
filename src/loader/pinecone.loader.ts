import { Injectable } from '@nestjs/common';
import { Index, Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeLoader {
  pineconeIndex: Index;

  constructor() {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME);
  }
}
