import { z } from 'zod';

export const EmotionSchema = z.object({
  triggerWords: z.array(z.string()),
  imageUrl: z.string().nullable(),
  file: z.any().nullable().optional(),
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
  first_message: z.array(z.string()),
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
  alternation_first: z.number().optional(),
  lorebook: z.string(),
  attribute: z.string().optional(),
  emotions: z.array(EmotionSchema).optional(),
  profileImageFile: z.any().nullable().optional(),
  emotionImageFile: z.any().nullable().optional(),
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

export const CharacterPayloadSchema = z.object({
  char_uuid: z.string().optional(),
  title: z.string(),
  name: z.string().default('Anon'),
  description: z.string(),
  persona: z.string(),
  model_instructions: z.string(),
  scenario: z.string(),
  gender: z.string(),
  message_example: z.string(),
  first_message: z.array(z.string()),
  creator: z.string(),
  tags: z.array(z.string()).default([]),
  profile_image: z.string(),
  is_public: z.boolean(),
  is_nsfw: z.boolean().optional(),
  is_owner: z.boolean().optional(),
  is_details_private: z.boolean().optional(),
  is_banned: z.boolean().optional(),
  creator_uuid: z.string(),
  lorebook: z.string(),
  attribute: z.string().optional(),
  emotions: z.array(EmotionSchema).optional(),
  profileImageFile: z.any().nullable().optional(),
  emotionImageFile: z.any().nullable().optional(),
});

export const CharacterSimpleSchema = z.object({
  title: z.string(),
  name: z.string().default('Anon'),
  description: z.string(),
  persona: z.string(),
  model_instructions: z.string(),
  first_message: z.array(z.string()),
  message_example: z.string(),
  scenario: z.string(),
  gender: z.string(),
  tags: z.array(z.string()).default([]),
  lorebook: z.string(),
  attribute: z.string(),
});

export type Character = z.infer<typeof CharacterSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type CharacterPayload = z.infer<typeof CharacterPayloadSchema>;
export type CharacterSimple = z.infer<typeof CharacterSimpleSchema>;
