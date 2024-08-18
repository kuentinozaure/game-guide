import { Injectable } from '@nestjs/common';
import { PineconeLoader } from './loader/pinecone.loader';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { PineconeStore } from '@langchain/pinecone';
import { DocumentInterface, Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const PATH_TO_DOCUMENTS = `/src/documents`;
@Injectable()
export class GameGuideRepository {
  private readonly hfEmbeddings = new HuggingFaceTransformersEmbeddings({
    model: 'Xenova/all-MiniLM-L6-v2',
  });

  constructor(private pinecone: PineconeLoader) {}

  /**
   * This methode request the Pinecone data based on the user prompt
   * @param prompt the user prompt
   * @returns the Pinecone data for the prompt
   */
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

    const similaritySearchResults = await vectorStore.similaritySearch(
      prompt,
      100,
    );

    return similaritySearchResults;
  }

  /**
   * This method insert the static game manual into the Pinecone index
   */
  async insertStaticGameManual() {
    const vectorStore = await PineconeStore.fromExistingIndex(
      this.hfEmbeddings,
      {
        pineconeIndex: this.pinecone.pineconeIndex,
        maxConcurrency: 5,
      },
    );

    const directoryLoader = new DirectoryLoader(
      `${process.cwd() + PATH_TO_DOCUMENTS}`,
      {
        '.pdf': (path: string) => new PDFLoader(path),
      },
    );

    const directoryDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 20,
    });

    const splitDocs = await textSplitter.splitDocuments(directoryDocs);

    // Remove metadata that is too large for Pinecone
    splitDocs.forEach((doc) => {
      delete doc.metadata.pdf;
      delete doc.metadata.loc;
      doc.metadata.source = doc.metadata.source.split(
        `${PATH_TO_DOCUMENTS}/`,
      )[1]; // avoid storing the full path
    });

    const ids = this.generateDocumentId(splitDocs);

    await vectorStore.addDocuments(splitDocs, {
      ids: ids,
    });
  }

  async deleteDocuments() {
    const vectorStore = await PineconeStore.fromExistingIndex(
      this.hfEmbeddings,
      {
        pineconeIndex: this.pinecone.pineconeIndex,
        maxConcurrency: 5,
      },
    );

    vectorStore.delete({
      deleteAll: true,
    });
  }

  /**
   * This methode generate the document id based on the document name and the index
   * @param documents the document chunks
   * @returns the document ids according the document and the chunk index
   */
  private generateDocumentId(
    documents: Document<Record<string, any>>[],
  ): string[] {
    let previousDocument = '';
    let index = 0;
    return documents.map((doc) => {
      const documentName = doc.metadata.source; // Document name
      if (documentName !== previousDocument) {
        previousDocument = documentName;
        index = 0;
      }

      const documentId = `${documentName}-${index}`;
      index += 1;

      return documentId;
    });
  }
}
