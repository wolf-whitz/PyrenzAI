export interface Character {
  id: string;
  char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  creator_uuid: string;
  chat_messages_count: number;
  tags: string[];
  profile_image: string;
  is_public: boolean;
  token_total: number;
}

export interface CharacterCardProps {
  id: string;
  char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  creator_uuid: string;
  chat_messages_count: number;
  tags: string[];
  profile_image: string;
  is_public: boolean;
  token_total: number;
  isLoading: boolean;
}

export interface CharacterData {
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  tags: string[];
  gender: string;
  creator: string | null;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: Record<string, number>;
  token_total: number;
}

export interface Draft {
  id: number;
  user_uuid: string;
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  tags: string[];
  gender: string;
  creator: string | null;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: Record<string, number>;
  token_total: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  error?: any;
  message?: string;
  character_uuid?: string;
  chat?: {
    chat_uuid: string;
  };
}
