// LangChain APIs
import { LLMChain } from "langchain/chains";
import { ChatCohere } from "langchain/chat_models/cohere";
import { ConversationSummaryMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";

// Environment variables
import { COHERE_API_KEY } from "../.env";
// Parameters
import { GPT_MODEL } from "../params/models";
// Types
import type { ConversationResponseType } from "../types/responseTypes";

// Component 1: short-term memory
const memory = new ConversationSummaryMemory({
  memoryKey: "chat_history",
  llm: new ChatCohere({
    modelName: GPT_MODEL,
    cohere_api_key: COHERE_API_KEY,
    temperature: 0,
  }),
});

// Component 2: chatbot
const model = new ChatCohere({
  modelName: GPT_MODEL,
  cohere_api_key: COHERE_API_KEY,
  temperature: 0,
});

// Component 3: prompt template
const prompt =
  PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

  Current conversation:
  {chat_history}
  Human: {input}
  AI:`);

// Component 4: model chain
const chain = new LLMChain({ llm: model, prompt, memory });

const run = async (inputValue: string): Promise<ConversationResponseType> => {
  const result = await chain.call({ input: inputValue });
  return result;
};

export default run;
