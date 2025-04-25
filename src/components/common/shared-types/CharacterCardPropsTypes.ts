export interface CharacterCardProps {
  id: string;
  input_char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  chat_messages_count: number;
  image_url: string;
  tags: string[];
  public: boolean;
  token_total: number;
}
