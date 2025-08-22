import llamaTokenizer from 'llama-tokenizer-js';
import debounce from 'lodash/debounce';

export const applyTokenizer = (value: string): number[] => {
  if (typeof value !== 'string') return [];
  return llamaTokenizer.encode(value);
};

export const decodeTokenizer = (tokens: number[]): string => {
  if (!Array.isArray(tokens)) return '';
  return llamaTokenizer.decode(tokens);
};

export const countTokens = (value: string): number => {
  return applyTokenizer(value).length;
};

export const createDebouncedTokenizer = (
  callback: (tokenCount: number) => void,
  delay = 250
) => {
  return debounce((value: string | string[]) => {
    const totalTokens = Array.isArray(value)
      ? value.reduce((sum, v) => sum + countTokens(v), 0)
      : countTokens(value);
    callback(totalTokens);
  }, delay);
};
