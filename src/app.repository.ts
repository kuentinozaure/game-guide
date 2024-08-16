import { Injectable } from '@nestjs/common';
import { PineconeLoader } from './loader/pinecone.loader';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { PineconeStore } from '@langchain/pinecone';
import { DocumentInterface } from '@langchain/core/documents';

@Injectable()
export class AppRepository {
  private readonly hfEmbeddings = new HuggingFaceTransformersEmbeddings({
    model: 'Xenova/all-MiniLM-L6-v2',
  });

  constructor(private pinecone: PineconeLoader) {}

  async requestPineconeData(
    prompt: string,
  ): Promise<DocumentInterface<Record<string, any>>[]> {
    const vectorStore = await PineconeStore.fromExistingIndex(
      this.hfEmbeddings,
      {
        pineconeIndex: this.pinecone.pineconeIndex,
        maxConcurrency: 5,
      },
    );

    // const document1: Document = {
    //   pageContent: 'The powerhouse of the cell is the mitochondria',
    //   metadata: { source: 'https://example.com' },
    // };

    // const document2: Document = {
    //   pageContent: 'Buildings are made out of brick',
    //   metadata: { source: 'https://example.com' },
    // };

    // const document3: Document = {
    //   pageContent: 'Mitochondria are made out of lipids',
    //   metadata: { source: 'https://example.com' },
    // };

    // const document4: Document = {
    //   pageContent: 'The 2024 Olympics are in Paris',
    //   metadata: { source: 'https://example.com' },
    // };

    // const documents = [document1, document2, document3, document4];

    // await vectorStore.addDocuments(documents, { ids: ['1', '2', '3', '4'] });

    const similaritySearchResults = await vectorStore.similaritySearch(
      prompt,
      2,
    );

    return similaritySearchResults;
  }

  async insertNewGameDocument() {}
}
