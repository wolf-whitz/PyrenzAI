import { z } from 'zod';

export const ChatMessagesPropsSchema = z.object({
  previous_message: z.any(),  
  isGenerating: z.boolean().optional(),
  messageId: z.string().nullable().optional(),
  token: z.number().nullable().optional(),
  role: z.string().nullable().optional(),
  user: z.object({
    username: z.string(),
    user_avatar: z.string(),
  }),
  char: z.object({
    name: z.string(),
    gender: z.string().optional(),
  }),
  onRegenerate: z.function().args(z.string()).returns(z.void()).optional(),
  onRemove: z.function().args(z.string()).returns(z.void()).optional(),
});

export type ChatMessagesProps = z.infer<typeof ChatMessagesPropsSchema>;
