import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.preprocess((val) => (val != null ? Number(val) : undefined), z.number()),
  name: z.string().optional(),
  text: z.string().optional(),
  profile_image: z.string().optional(),
  type: z.enum(['user', 'char']),
  username: z.string().optional(),
  isGenerate: z.boolean().optional(),
  role: z.string().optional(),
  chat_uuid: z.string().optional(),
  error: z.boolean().optional(),
  gender: z.string().optional(),
  user_id: z.string().optional(),
  char_id: z.string().optional(),
  alternative_messages: z.array(z.string()).optional(),
  current: z.number().default(0).optional(),
  meta: z.object({
    queryText: z.string(),
  }).optional(),
  emotion_type: z.string().optional(),
});

export const UserSchema = z.object({
  username: z.string(),
  user_avatar: z.string(),
  user_uuid: z.string(),
  isOwner: z.boolean(),
  subscription_plan: z.enum(['Melon', 'Durian', 'Pineapple']),
  is_subscribed: z.boolean(),
});

export const ChatContainerPropsSchema = z.object({
  firstMessage: z.string().nullable(),
  previous_message: z.array(MessageSchema),
  isGenerating: z.boolean(),
  handleSend: z.function().args(z.string()).returns(z.promise(z.void())),
  messageIdRef: z.object({
    char_uuid: z.string().nullable(),
    user_uuid: z.string().nullable(),
  }).nullable(),
  messagesEndRef: z.any(),
});

export const GenerateResponseSchema = z.object({
  role: z.string(),
  content: z.string(),
  MessageID: z.preprocess((val) => (val != null ? Number(val) : undefined), z.number()),
  remainingMessages: z.number(),
  isSubscribed: z.boolean(),
  user_uuid: z.string(),
  char_uuid: z.string(),
});

export const ChatSchema = z.object({
  chat_uuid: z.string(),
  char_id: z.string(),
  preview_message: z.string(),
  preview_image: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;
export type User = z.infer<typeof UserSchema>;
export type ChatContainerProps = z.infer<typeof ChatContainerPropsSchema>;
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
export type Chat = z.infer<typeof ChatSchema>;
