import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { DocumentInterface } from '@langchain/core/documents';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';

@Injectable()
export class AppService {
  constructor(private readonly appRepo: AppRepository) {}

  async getHello(prompt: string): Promise<string> {
    const data = await this.appRepo.requestPineconeData(prompt);
    const promptTemplate = this.createPromptTemplate();
    const contextText: string = data
      .map((doc) => doc.pageContent)
      .join('\n\n---\n\n');

    const formattedPrompt = await promptTemplate.formatPromptValue({
      context: contextText,
      userPrompt: prompt,
    });

    const llmInstance = new ChatGroq({
      model: 'llama3-8b-8192',
      temperature: 0,
      maxTokens: undefined,
      maxRetries: 2,
    });

    const aiMsg = await llmInstance.invoke(formattedPrompt);

    return aiMsg.content.toString();
  }

  async insertStaticGameManual() {
    await this.appRepo.insertStaticGameManual();
  }

  private createPromptTemplate(): PromptTemplate {
    return PromptTemplate.fromTemplate(
      `Answer the question based only on the following context:

      {context}

      ---

      Answer the question based on the above context: {userPrompt}`,
    );
  }
}
