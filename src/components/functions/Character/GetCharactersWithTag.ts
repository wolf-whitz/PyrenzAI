import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

export async function GetCharactersWithTags(
  maxCharacter: number,
  page: number,
  type: string,
  tag: string,
  gender?: string,
  searchQuery?: string
): Promise<Character[]> {
  if (type !== 'GetTaggedCharacters') {
    throw new Error('Invalid type');
  }

  const { show_nsfw, blocked_tags } = useUserStore.getState();

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    search: searchQuery || null,
    show_nsfw,
    blocked_tags,
    gender: gender || null,
    tag: tag || null
  });

  if (error) throw new Error(error.message);
  return data?.characters ?? [];
}
