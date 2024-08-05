import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const getRecipeSuggestion = async (pantryItems) => {
  const prompt = `Generate a few recipe suggestions using any of the following pantry items: ${pantryItems.map(item => item.id).join(', ')}. Include instructions for each recipe.`;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
    });

    return completion.data.choices[0].text;
  } catch (error) {
    console.error('Error generating recipe suggestions:', error);
    throw error;
  }
};
