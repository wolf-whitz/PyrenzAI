import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

export async function GetHotCharacters(
  type: string,
  maxCharacter: number,
  page: number
): Promise<Character[]> {
  if (type !== 'hot') {
    throw new Error('Invalid type');
  }

  const { show_nsfw, blocked_tags } = useUserStore.getState();

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    show_nsfw,
    blocked_tags: blocked_tags || [],
    gender_filter: null,
    search: null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.characters || [];
}
