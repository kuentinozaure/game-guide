import { Injectable } from '@nestjs/common';
import { GameGuideRepository } from './game-guide.repository';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';

@Injectable()
export class GameGuideService {
  constructor(private readonly appRepo: GameGuideRepository) {}

  async getGameGuideInfo(prompt: string): Promise<string> {
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
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      maxTokens: undefined,
      maxRetries: 2,
    });

    const aiMsg = await llmInstance.invoke(formattedPrompt);

    return aiMsg.content.toString();
  }

  async insertStaticGameManual() {
    await this.appRepo.insertStaticGameManual();
  }

  async deleteAllDocuments() {
    await this.appRepo.deleteDocuments();
  }

  private createPromptTemplate(): PromptTemplate {
    return PromptTemplate.fromTemplate(
      `Answer the question based only on the following context:

      {context}

      ---

      Answer the question based on the above context: {userPrompt}
      --- 

      - If you don't know the answer, you can say "Its not referenced in game manual, double check the game manual or internet"
      - Be clear and concise in your response.
      - only reply to the answer of the question.

      ---
      `,
    );
  }
}
