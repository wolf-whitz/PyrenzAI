export interface CharacterCardProps {
  id: string;
  input_char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  chat_messages_count: number;
  profile_image: string;
  tags: string[];
  is_public: boolean;
  token_total: number;
}
