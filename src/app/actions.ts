'use server';

import { extractDimensions } from '@/ai/flows/extract-dimensions-flow';
import type { ExtractDimensionsInput } from '@/ai/flows/extract-dimensions-flow';

export async function extractDimensionsFromBlueprint(input: ExtractDimensionsInput) {
    return await extractDimensions(input);
}
