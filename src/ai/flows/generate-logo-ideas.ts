'use server';
/**
 * @fileOverview A flow to generate logo design ideas and branding concepts.
 * This is for a new conceptual website, "PixelPerfect".
 *
 * - generateLogoIdeas - A function that generates logo concepts.
 * - GenerateLogoIdeasInput - The input type for the function.
 * - GenerateLogoIdeasOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLogoIdeasInputSchema = z.object({
  companyName: z.string().describe('The name of the company or brand.'),
  description: z.string().describe('A brief description of what the company does and its target audience.'),
  stylePreferences: z.string().optional().describe('Any style preferences, e.g., "minimalist", "vintage", "modern", "playful".'),
});
export type GenerateLogoIdeasInput = z.infer<typeof GenerateLogoIdeasInputSchema>;

const LogoConceptSchema = z.object({
    conceptName: z.string().describe('A catchy name for the logo concept, e.g., "The Innovator\'s Mark".'),
    visualDescription: z.string().describe('A detailed visual description of the logo design, including shapes, imagery, and layout.'),
    symbolism: z.string().describe('An explanation of the symbolism and meaning behind the design choices.'),
});

const GenerateLogoIdeasOutputSchema = z.object({
  brandingKeywords: z.array(z.string()).describe('An array of 5-7 keywords that capture the brand\'s essence.'),
  colorPalette: z.array(z.object({
      hex: z.string().describe('The hex code of the color, e.g., "#4A90E2".'),
      name: z.string().describe('A descriptive name for the color, e.g., "Innovation Blue".'),
      usage: z.string().describe('Recommended usage for this color, e.g., "Primary, for logos and CTAs".')
  })).describe('A suggested color palette with 4-5 colors.'),
  logoConcepts: z.array(LogoConceptSchema).describe('An array of 3 distinct logo design concepts.'),
});
export type GenerateLogoIdeasOutput = z.infer<typeof GenerateLogoIdeasOutputSchema>;


export async function generateLogoIdeas(input: GenerateLogoIdeasInput): Promise<GenerateLogoIdeasOutput> {
  return generateLogoIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLogoIdeasPrompt',
  input: {schema: GenerateLogoIdeasInputSchema},
  output: {schema: GenerateLogoIdeasOutputSchema},
  prompt: `You are "PixelPerfect", an expert AI branding and design consultant. Your task is to generate a comprehensive branding starter kit based on the user's company details.

Company Name: {{{companyName}}}
Description: {{{description}}}
Style Preferences: {{{stylePreferences}}}

**Instructions:**

1.  **Branding Keywords:** Generate 5-7 powerful keywords that reflect the brand's core identity.
2.  **Color Palette:** Create a harmonious color palette with 4-5 colors. For each color, provide its hex code, a creative name, and its recommended usage (e.g., primary, accent, background).
3.  **Logo Concepts:** Design three unique and creative logo concepts. For each concept, provide:
    *   A memorable name for the concept.
    *   A detailed visual description of the logo.
    *   An explanation of the symbolism behind the design.

Be creative, modern, and professional. The user is looking for high-quality, actionable ideas.`,
});

const generateLogoIdeasFlow = ai.defineFlow(
  {
    name: 'generateLogoIdeasFlow',
    inputSchema: GenerateLogoIdeasInputSchema,
    outputSchema: GenerateLogoIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
