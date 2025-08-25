import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePyrenzAlert } from '~/provider';
import { GetUserUUID, CreateNewChat } from '@components';
import * as Sentry from '@sentry/react';
import { Utils as utils } from '~/utility';
import { Character } from '@shared-types';

interface UseCharacterModalApiProps {
  character: Character | null;
  isOwner: boolean;
  onClose: () => void;
  onCharacterDeleted: () => void;
}

export const useCharacterModalApi = ({
  character: initialCharacter,
  isOwner,
  onClose,
  onCharacterDeleted,
}: UseCharacterModalApiProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    const fetchUserUUID = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUUID(uuid);
      } catch (error) {
        console.error('Error fetching user UUID:', error);
        Sentry.captureException(error);
      }
    };
    fetchUserUUID();
  }, []);

  const fetchCharacter = async (charUuid: string) => {
    try {
      const { data: publicCharacter } = await utils.db.select<Character>({
        tables: 'public_characters',
        columns: '*',
        match: { char_uuid: charUuid },
      });

      if (publicCharacter?.length) {
        return publicCharacter[0];
      }

      const { data: privateCharacter } = await utils.db.select<Character>({
        tables: 'private_characters',
        columns: '*',
        match: { char_uuid: charUuid },
      });

      if (privateCharacter?.length) {
        return privateCharacter[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching character:', error);
      Sentry.captureException(error);
      showAlert('Error fetching character details.', 'Alert');
      return null;
    }
  };

  const handleCreatorClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (initialCharacter?.creator_uuid) {
        navigate(`/profile/${initialCharacter.creator_uuid}`);
      }
    },
    [initialCharacter?.creator_uuid, navigate]
  );

  const handleChatNow = async () => {
    if (isLoading || !initialCharacter?.char_uuid) return;
    if (!userUUID) {
      showAlert('You need to be logged in to chat with a bot.', 'Alert');
      return;
    }
    setIsLoading(true);
    try {
      const character = await fetchCharacter(initialCharacter.char_uuid);
      if (!character) {
        showAlert('Character not found.', 'Alert');
        return;
      }
      const response = await CreateNewChat(character.char_uuid, userUUID);
      if (response?.chat_uuid) {
        navigate(`/chat/${response.chat_uuid}`);
      } else {
        console.error('Failed to generate chat_uuid');
        showAlert('Failed to generate chat UUID.', 'Alert');
      }
    } catch (error) {
      console.error('Error generating chat_uuid:', error);
      Sentry.captureException(error);
      showAlert('Error generating chat UUID.', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCharacter = async () => {
    if (!initialCharacter?.char_uuid) return;
    const character = await fetchCharacter(initialCharacter.char_uuid);
    if (character) {
      navigate(`/create/${character.char_uuid}`, {
        state: { character, isOwner },
      });
    }
  };

  const handleDeleteCharacter = async () => {
    if (!initialCharacter?.char_uuid) return;
    setIsLoading(true);
    try {
      await utils.db.remove({
        tables: 'public_characters',
        match: { char_uuid: initialCharacter.char_uuid },
      });

      showAlert('Character deleted successfully!', 'Success');
      onClose();
      onCharacterDeleted();
    } catch (publicError: any) {
      if (publicError?.code !== 'PGRST116') {
        console.error('Error deleting from public_characters:', publicError);
        Sentry.captureException(publicError);
        showAlert('Error deleting character.', 'Alert');
        setIsLoading(false);
        return;
      }
      try {
        await utils.db.remove({
          tables: 'private_characters',
          match: { char_uuid: initialCharacter.char_uuid },
        });

        showAlert('Character deleted successfully!', 'Success');
        onClose();
        onCharacterDeleted();
      } catch (privateError) {
        console.error('Error deleting from private_characters:', privateError);
        Sentry.captureException(privateError);
        showAlert('Error deleting character.', 'Alert');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    userUUID,
    handleCreatorClick,
    handleChatNow,
    handleEditCharacter,
    handleDeleteCharacter,
  };
};
