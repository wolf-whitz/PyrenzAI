import { z } from 'zod';

export const EmotionSchema = z.object({
  triggerWords: z.array(z.string()),
  imageUrl: z.string().nullable(),
});

export const CharacterSchema = z.object({
  id: z.number().optional(),
  char_uuid: z.string(),

  title: z.string(),
  name: z.string().default('Anon'),
  description: z.string(),
  persona: z.string(),

  model_instructions: z.string(),
  scenario: z.string(),
  gender: z.string(),

  first_message: z.string(),
  creator: z.string(),

  tags: z.array(z.string()).default([]),
  profile_image: z.string(),
  chat_messages_count: z.number().optional(),

  is_public: z.boolean(),
  is_nsfw: z.boolean().optional(),
  is_owner: z.boolean().optional(),

  is_details_private: z.boolean().optional(),
  is_banned: z.boolean().optional(),

  isLoading: z.boolean().optional(),
  creator_uuid: z.string(),

  lorebook: z.string(),
  attribute: z.string().optional(),

  emotions: z.array(EmotionSchema).optional(),
});

export const DraftSchema = z.object({
  id: z.number().optional(),
  user_uuid: z.string(),
  persona: z.string(),
  name: z.string(),
  model_instructions: z.string(),
  scenario: z.string(),
  description: z.string(),
  first_message: z.string(),
  tags: z.string(),
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

export type Character = z.infer<typeof CharacterSchema>;
export type Draft = z.infer<typeof DraftSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
