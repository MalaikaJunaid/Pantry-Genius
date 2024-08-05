// pages/api/get-recipe-suggestions.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { pantryItems } = req.body;

    if (!pantryItems || !Array.isArray(pantryItems)) {
      return res.status(400).json({ error: 'Invalid pantry items' });
    }

    const prompt = `Generate a few recipe suggestions using any of the following pantry items: ${pantryItems.join(', ')}. Include instructions for each recipe.`;

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const suggestions = completion.data.choices[0].text;

      // Format the response text into an array of recipes
      const recipes = parseRecipes(suggestions);

      res.status(200).json({ recipes });
    } catch (error) {
      console.error('Error generating recipe suggestions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const parseRecipes = (text) => {
  // Implement parsing logic to convert the OpenAI response text into a usable format
  // For simplicity, assuming the text is already in a suitable format or use regex to extract data
  return text.split('\n').map((line, index) => ({
    title: `Recipe ${index + 1}`,
    ingredients: line.split(','),
    sourceUrl: '#', // Placeholder; update if URL is part of the response
  }));
};
