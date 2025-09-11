// Summarizes the content of a PDF file provided as a data URI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf';

const SummarizePdfContentInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF file content as a data URI (e.g., data:application/pdf;base64,...).'
    ),
});

export type SummarizePdfContentInput = z.infer<
  typeof SummarizePdfContentInputSchema
>;

const SummarizePdfContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the PDF content.'),
});

export type SummarizePdfContentOutput = z.infer<
  typeof SummarizePdfContentOutputSchema
>;

export async function summarizePdfContent(
  input: SummarizePdfContentInput
): Promise<SummarizePdfContentOutput> {
  return summarizePdfContentFlow(input);
}

const summarizePdfContentPrompt = ai.definePrompt({
  name: 'summarizePdfContentPrompt',
  input: {schema: z.object({pdfContent: z.string()})},
  output: {schema: SummarizePdfContentOutputSchema},
  prompt: `Summarize the following PDF content. Be concise and focus on the main points.\n\nPDF Content: {{{pdfContent}}}`,
});

const summarizePdfContentFlow = ai.defineFlow(
  {
    name: 'summarizePdfContentFlow',
    inputSchema: SummarizePdfContentInputSchema,
    outputSchema: SummarizePdfContentOutputSchema,
  },
  async input => {
    // Extract the base64 encoded PDF data from the data URI
    const base64Pdf = input.pdfDataUri.split(',')[1];

    // Decode the base64 data to binary
    const pdfBuffer = Buffer.from(base64Pdf, 'base64');

    // Use a BufferLoader to load the PDF data
    const loader = new PDFLoader(pdfBuffer);
    const docs = await loader.load();

    // Extract text content from the loaded PDF
    const pdfContent = docs.map(doc => doc.pageContent).join('\n');

    const {output} = await summarizePdfContentPrompt({
      pdfContent,
    });
    return output!;
  }
);
