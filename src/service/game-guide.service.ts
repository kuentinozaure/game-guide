import { Injectable } from '@nestjs/common';
import { GameGuideRepository } from '../repository/game-guide.repository';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';

@Injectable()
export class GameGuideService {
  constructor(private readonly appRepo: GameGuideRepository) {}

  async getGameGuideInfo(prompt: string): Promise<string> {
    const llmInstance = new ChatGroq({
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      maxTokens: undefined,
      maxRetries: 2,
    });

    const pineconeQuery = await this.setUpPromptToRequestPinecone(
      prompt,
    ).formatPromptValue({});

    const pineconeLlmResponse = await llmInstance.invoke(pineconeQuery);

    if (pineconeLlmResponse.content.toString().includes('false')) {
      const fallbBackPrompt = await this.fallBackPrompt(
        prompt,
      ).formatPromptValue({});

      const llmResponse = await llmInstance.invoke(fallbBackPrompt);

      console.log('Fallback LLM Response:', llmResponse.content.toString());
      return llmResponse.content.toString();
    }

    const data = await this.appRepo.requestPineconeData(
      pineconeLlmResponse.content.toString(),
    );

    const promptTemplate = this.createPromptTemplate();
    const contextText: string = data
      .map((doc) => doc.pageContent)
      .join('\n\n---\n\n');

    const formattedPrompt = await promptTemplate.formatPromptValue({
      context: contextText,
      userPrompt: prompt,
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

  private setUpPromptToRequestPinecone(prompt: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`
         You are used to query a vectorial database.
         The vectorial database is populated with english game manuals.
         You receive a prompt and you have to setup a prompt to query this database efficiently.
         You must follow the writing logic of game manuals.
         You must be concise and clear in your prompt.
         You must translate the user prompt in english.
         Return only a string value with the data transformed
         No hallucinations, and return a question

         eg: J aimerais jouer au uno comment faire -> Instructions to play uno
         eg: How many players to play uno -> Number of players to play uno
         
         ---- The prompt from the user ----
          ${prompt}

          if prompt is not about game manual or in the game manual context return -> 'false'
   `);
  }

  private fallBackPrompt(prompt: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`
       Just reply to the user according to his prompt and his language.
       be consise and clear in your response.
       don't write a book, just a few words.
       act like an human and be polite.

       ---- example of response ----

       eg: User: Hello --- You: Hi, how can I help you?
       eg: User: Comment va tu ? --- You: Je vais bien merci, comment puis-je vous aider?

        ---- The prompt from the user ---- 

        ${prompt}
   `);
  }
}
