import { z } from "zod"

export const MessageSchema = z.object({
  id: z.string().optional(),
  character_name: z.string(),
  username: z.string().optional(),
  text: z.string(),
  icon: z.string(),
  type: z.enum(["user", "assistant"]),
  token: z.number().nullable().optional(),
  role: z.string().nullable().optional(),
  error: z.boolean().optional(),
  gender: z.string().optional(),
})

export type Message = z.infer<typeof MessageSchema>

export const ChatMessagesPropsSchema = z.object({
  previous_message: z.array(MessageSchema),
  isGenerating: z.boolean().optional(),
  messageId: z.string().nullable().optional(),
  token: z.number().nullable().optional(),
  role: z.string().nullable().optional(),
  user: z.object({
    username: z.string(),
  }),
  char: z.object({
    character_name: z.string(),
    gender: z.string().optional(),
  }),
  onRegenerate: z.function().args(z.string()).returns(z.void()).optional(),
  onRemove: z.function().args(z.string()).returns(z.void()).optional(),
})

export type ChatMessagesProps = z.infer<typeof ChatMessagesPropsSchema>
