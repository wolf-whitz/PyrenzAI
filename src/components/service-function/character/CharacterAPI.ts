import { useState, useEffect } from 'react';
import { CharacterSchema, GetUserUUID } from '~/components';
import { Utils } from '~/Utility';
import { usePyrenzAlert } from '~/provider';

export const useCharacterData = (char_uuid: string | undefined) => {
  const [character, setCharacter] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!char_uuid) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const match = { char_uuid };

        const [publicRes, privateRes] = await Promise.all([
          Utils.db.select<any>('public_characters', '*', 'exact', match),
          Utils.db.select<any>('private_characters', '*', 'exact', match),
        ]);

        const foundCharacter =
          publicRes.data?.[0] || privateRes.data?.[0] || null;

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

      if (deleted.length > 0) {
        showAlert('Character deleted successfully', 'success');
        return true;
      } else {
        showAlert('Character could not be deleted', 'error');
        return false;
      }
    } catch (err) {
      console.error('🚫 Failed to delete character:', err);
      showAlert('Error deleting character', 'error');
      return false;
    }
  };

  const handleReportCharacter = async (
    reportText: string,
    creator_uuid: string
  ): Promise<boolean> => {
    if (!char_uuid) return false;

    try {
      const user_uuid = await GetUserUUID();
      if (!user_uuid) return false;

      const reportData = {
        user_uuid,
        char_uuid,
        creator_uuid,
        report_content: reportText,
      };

      const result = await Utils.db.insert('character_reports', reportData, {
        onConflict: ['user_uuid', 'char_uuid'],
      });

      if (result.length > 0) {
        showAlert('Your report has been submitted.', 'success');
        return true;
      }

      showAlert('Could not submit report.', 'error');
      return false;
    } catch (err) {
      console.error('Failed to report character:', err);
      showAlert('An error occurred while reporting.', 'error');
      return false;
    }
  };

  return {
    character,
    notFound,
    loading,
    handleDeleteCharacter,
    handleReportCharacter,
  };
};
