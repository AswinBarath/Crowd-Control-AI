'use server';
/**
 * @fileOverview Converts text to speech.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion.
 */
import { textToSpeechFlow, TextToSpeechInput, TextToSpeechOutput } from './text-to-speech-flow';

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    return textToSpeechFlow(input);
}
