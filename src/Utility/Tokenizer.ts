import llamaTokenizer from 'llama-tokenizer-js';

/**
 * Tokenizes a string input using llamaTokenizer.
 * @param value - The input string to tokenize.
 * @returns An array of token integers.
 */
export const applyTokenizer = (value: string): number[] => {
  if (typeof value !== 'string') return [];
  return llamaTokenizer.encode(value);
};

/**
 * Decodes an array of token integers back into a string.
 * @param tokens - The array of tokens to decode.
 * @returns The decoded string.
 */
export const decodeTokenizer = (tokens: number[]): string => {
  if (!Array.isArray(tokens)) return '';
  return llamaTokenizer.decode(tokens);
};

/**
 * Returns the token count of a given string.
 * @param value - The input string.
 * @returns Number of tokens.
 */
export const countTokens = (value: string): number => {
  return applyTokenizer(value).length;
};
