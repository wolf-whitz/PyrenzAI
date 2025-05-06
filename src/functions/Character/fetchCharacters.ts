import { supabase } from '~/Utility/supabaseClient';

interface Character {
    id: number;
    input_char_uuid: string;
    name: string;
    description: string;
    first_message: string;
    profile_image: string;
    tags: string[];
    creator: string;
    chat_messages_count: number;
    is_public: boolean;
    token_total: number;
}

interface FetchCharactersResponse {
    characters: Character[];
    total: number;
}

export async function fetchCharacters(
    requestType: string,
    searchTerm: string | null = null,
    page: number = 1,
    itemsPerPage: number = 10
): Promise<FetchCharactersResponse> {
    if (requestType !== 'character') {
        throw new Error(`Invalid request_type: ${requestType}`);
    }

    const query = supabase
        .from('characters')
        .select('*', { count: 'exact' })
        .eq('is_nsfw', false)
        .ilike('name', `%${searchTerm ? searchTerm.toLowerCase() : ''}%`)
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

    const { data, error, count } = await query;

    if (error) {
        throw new Error(`Error fetching characters: ${error.message}`);
    }

    const characters = data ? data : [];
    return {
        characters,
        total: count ?? 0
    };
}
