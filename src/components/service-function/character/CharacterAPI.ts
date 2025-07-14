import { useState, useEffect } from 'react';
import { CharacterSchema, GetUserUUID } from '~/components';
import { supabase } from '~/Utility';

export const useCharacterData = (char_uuid: string | undefined) => {
  const [character, setCharacter] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!char_uuid) {
        setNotFound(true);
        return;
      }

      try {
        const fetchFromTable = async (table: string) => {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('char_uuid', char_uuid)
            .maybeSingle();

          if (error) return null;
          return data;
        };

        let result = await fetchFromTable('public_characters');
        if (!result) result = await fetchFromTable('private_characters');

        if (result) {
          const transformedCharacter = {
            ...result,
            id: result.id ? String(result.id) : undefined,
            tags: result.tags || [],
            is_details_private: result.is_details_private ?? false,
            is_nsfw: result.is_nsfw ?? false,
          };

          const verifiedCharacter = CharacterSchema.parse(transformedCharacter);
          setCharacter(verifiedCharacter);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
    };

    fetchCharacterData();
  }, [char_uuid]);

  const handleDeleteCharacter = async () => {
    if (!char_uuid) return false;

    try {
      const user_uuid = await GetUserUUID();
      if (!user_uuid) return false;

      const tableName = character?.is_public
        ? 'public_characters'
        : 'private_characters';

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('char_uuid', char_uuid)
        .eq('creator_uuid', user_uuid);

      if (error) return false;

      return true;
    } catch {
      return false;
    }
  };

  return { character, notFound, handleDeleteCharacter };
};
