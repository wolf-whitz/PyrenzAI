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
  if (type !== 'tags') {
    throw new Error('Invalid type');
  }

  const { show_nsfw, blocked_tags } = useUserStore.getState();

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    search: searchQuery || null,
    show_nsfw,
    blocked_tags: blocked_tags || [],
    gender_filter: gender || null,
    tag: tag ? [tag] : [],
  });

  if (error) throw new Error(error.message);
  return data?.characters || [];
}
