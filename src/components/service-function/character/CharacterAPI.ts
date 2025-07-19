import { useState, useEffect } from 'react';
import { CharacterSchema, GetUserUUID } from '~/components';
import { Utils } from '~/Utility';

export const useCharacterData = (char_uuid: string | undefined) => {
  const [character, setCharacter] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!char_uuid) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const { data: foundCharacter } = await Utils.db.selectFirstAvailable<any>(
          ['public_characters', 'private_characters'],
          { char_uuid }
        );

        if (foundCharacter) {
          const verifiedCharacter = CharacterSchema.parse({
            ...foundCharacter,
            id: foundCharacter.id ? String(foundCharacter.id) : undefined,
            tags: foundCharacter.tags || [],
            is_details_private: foundCharacter.is_details_private ?? false,
            is_nsfw: foundCharacter.is_nsfw ?? false,
          });

          setCharacter(verifiedCharacter);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('💥 Error fetching character:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [char_uuid]);

  const handleDeleteCharacter = async (): Promise<boolean> => {
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
    } catch (err) {
      console.error('🚫 Failed to delete character:', err);
      return false;
    }
  };

  return { character, notFound, loading, handleDeleteCharacter };
};
