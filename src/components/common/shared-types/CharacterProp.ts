export interface Character {
  id: string;
  input_char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  chat_messages_count: number;
  image_url: string;
  tags: string[];
  is_public: boolean;
  token_total: number;
}

export interface CharacterData {
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  tags: string;
  gender: string;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: { [key: string]: number };
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
  tags: string;
  gender: string;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: { [key: string]: number };
  token_total: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  data?: any;
  error?: any;
}
