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
}

export async function GetHotCharacters(
    type: string,
    maxCharacter: number,
    page: number
): Promise<Character[]> {
    if (type === 'GetHotCharacter') {
        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('is_nsfw', false)
            .order('chat_messages_count', { ascending: false })
            .limit(maxCharacter)
            .range((page - 1) * maxCharacter, page * maxCharacter - 1);

        if (error) {
            throw new Error(error.message);
        }

        return data as Character[];
    } else {
        throw new Error('Invalid type');
    }
}