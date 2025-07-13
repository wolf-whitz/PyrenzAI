import { useState, useEffect } from 'react';
import { CharacterSchema, GetUserUUID } from '~/components';
import { fetchCharacters } from '@function';
import { supabase } from '~/Utility';

export const useCharacterData = (char_uuid: string | undefined) => {
  const [character, setCharacter] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        if (!char_uuid) {
          setNotFound(true);
          return;
        }

        const response = await fetchCharacters({
          currentPage: 1,
          itemsPerPage: 1,
          charuuid: char_uuid,
          showNsfw: true,
        });

        if (response.characters && response.characters.length > 0) {
          const transformedCharacter = {
            ...response.characters[0],
            id: response.characters[0].id
              ? String(response.characters[0].id)
              : undefined,
            tags: response.characters[0].tags || [],
            is_details_private:
              response.characters[0].is_details_private ?? false,
          };
          const verifiedCharacter = CharacterSchema.parse(transformedCharacter);
          setCharacter(verifiedCharacter);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch character data:', error);
        setNotFound(true);
      }
    };

    fetchCharacterData();
  }, [char_uuid]);

  const handleDeleteCharacter = async () => {
    if (!char_uuid) return false;

    try {
      const user_uuid = await GetUserUUID();
      if (!user_uuid) {
        console.error('User UUID not found');
        return false;
      }

      const tableName = character.is_public ? 'public_characters' : 'private_characters';

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('char_uuid', char_uuid)
        .eq('creator_uuid', user_uuid);

      if (error) {
        console.error('Failed to delete character:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting character:', error);
      return false;
    }
  };

  return { character, notFound, handleDeleteCharacter };
};
