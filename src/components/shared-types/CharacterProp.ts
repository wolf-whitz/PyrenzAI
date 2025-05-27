import { z } from 'zod';

export const CharacterSchema = z.object({
  id: z.string(),
  char_uuid: z.string(),
  name: z.string(),
  description: z.string(),
  creator: z.string().nullable(),
  creator_uuid: z.string(),
  chat_messages_count: z.number(),
  tags: z.array(z.string()),
  profile_image: z.string(),
  is_public: z.boolean(),
  is_nsfw: z.boolean(),
  token_total: z.number(),
  isLoading: z.boolean(),
});

export const CharacterCardPropsSchema = z.object({
  id: z.string(),
  char_uuid: z.string(),
  name: z.string(),
  description: z.string(),
  creator: z.string().nullable(),
  creator_uuid: z.string(),
  chat_messages_count: z.number(),
  tags: z.array(z.string()),
  profile_image: z.string(),
  is_public: z.boolean(),
  is_nsfw: z.boolean(),
  token_total: z.number(),
  isLoading: z.boolean(),
});

export const CharacterDataSchema = z.object({
  char_uuid: z.string().optional(),
  persona: z.string(),
  name: z.string(),
  model_instructions: z.string(),
  scenario: z.string(),
  description: z.string(),
  first_message: z.string(),
  tags: z.array(z.string()),
  gender: z.string(),
  creator: z.string().nullable(),
  is_public: z.boolean(),
  is_nsfw: z.boolean(),
  token_total: z.number(),
  profile_image: z.string(),
  textarea_token: z.record(z.number()).optional(),
  chat_message_count: z.number().optional(),
});

export const DraftSchema = z.object({
  id: z.number(),
  user_uuid: z.string(),
  persona: z.string(),
  name: z.string(),
  model_instructions: z.string(),
  scenario: z.string(),
  description: z.string(),
  first_message: z.string(),
  tags: z.array(z.string()),
  gender: z.string(),
  creator: z.string().nullable(),
  is_public: z.boolean(),
  is_nsfw: z.boolean(),
  textarea_token: z.record(z.number()),
  token_total: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ApiResponseSchema = z.object({
  error: z.any().optional(),
  message: z.string().optional(),
  character_uuid: z.string().optional(),
  chat: z
    .object({
      chat_uuid: z.string(),
    })
    .optional(),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type CharacterData = z.infer<typeof CharacterDataSchema>;
export type Draft = z.infer<typeof DraftSchema>;
export type CharacterCardProps = z.infer<typeof CharacterCardPropsSchema>;
export type Character = z.infer<typeof CharacterSchema>;
