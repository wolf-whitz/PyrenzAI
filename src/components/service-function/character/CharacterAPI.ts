import { useState, useEffect } from 'react';
import { CharacterSchema, GetUserUUID } from '~/components';
import { Utils } from '~/Utility';

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
          const { data } = await Utils.db.select<any>(table, '*', null, {
            char_uuid,
          });
          return data[0] ?? null;
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

      const deleted = await Utils.db.delete(tableName, {
        char_uuid,
        creator_uuid: user_uuid,
      });

      return deleted.length > 0;
    } catch {
      return false;
    }
  };

  return { character, notFound, handleDeleteCharacter };
};
