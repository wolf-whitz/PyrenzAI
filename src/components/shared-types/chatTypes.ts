import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  text: z.string(),
  profile_image: z.string(),
  type: z.enum(['user', 'char']),
  username: z.string().optional(),
  isGenerate: z.boolean().optional(),
  isFirst: z.boolean().optional(),
  token: z.number().nullable().optional(),
  role: z.string().optional(),
  chat_uuid: z.string().optional(),
  error: z.boolean().optional(),
  gender: z.string().optional(),
  user_id: z.number().optional(),
  char_id: z.number().optional(),
  alternative_messages: z.array(z.string()).optional(),
  meta: z
    .object({
      queryText: z.string(),
    })
    .optional(),
});

export const UserSchema = z.object({
  username: z.string(),
  user_avatar: z.string(),
  user_uuid: z.string(),
  isOwner: z.boolean().optional(),
  subscription_plan: z.enum(['Melon', 'Durian', 'Pineapple']).optional(),
  is_subscribed: z.boolean().optional(),
});

export const ChatContainerPropsSchema = z.object({
  firstMessage: z.string().nullable().optional(),
  previous_message: z.array(MessageSchema).optional(),
  isGenerating: z.boolean().optional(),
  handleSend: z
    .function()
    .args(z.string())
    .returns(z.promise(z.void()))
    .optional(),
  messageIdRef: z
    .object({
      charId: z.string().nullable(),
      userId: z.string().nullable(),
    })
    .nullable()
    .optional(),
  messagesEndRef: z.any().optional(),
});

export const GenerateResponseSchema = z.object({
  role: z.string(),
  content: z.string(),
  MessageID: z.string(),
  remainingMessages: z.number(),
  isSubscribed: z.boolean().optional(),
  user_id: z.number().optional(),
  char_id: z.number().optional(),
});

export const ChatSchema = z.object({
  chat_uuid: z.string(),
  char_uuid: z.string(),
  preview_message: z.string(),
  preview_image: z.string(),
});

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type User = z.infer<typeof UserSchema>;
export type ChatContainerProps = z.infer<typeof ChatContainerPropsSchema>;
export type Chat = z.infer<typeof ChatSchema>;
