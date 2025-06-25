import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePyrenzAlert } from '~/provider';
import { GetUserUUID, CreateNewChat } from '@components';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';

interface UseCharacterModalApiProps {
  character: Character | null;
  isOwner: boolean;
  onClose: () => void;
}

export const useCharacterModalApi = ({
  character: initialCharacter,
  isOwner,
  onClose,
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
      const { data: publicCharacter, error: publicError } = await supabase
        .from('public_characters')
        .select('*')
        .eq('char_uuid', charUuid)
        .single();

      if (publicError && publicError.code !== 'PGRST116') {
        throw publicError;
      }

      if (publicCharacter) {
        return publicCharacter;
      }

      const { data: privateCharacter, error: privateError } = await supabase
        .from('private_characters')
        .select('*')
        .eq('char_uuid', charUuid)
        .single();

      if (privateError) {
        throw privateError;
      }

      return privateCharacter;
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
      const { error: publicDeleteError } = await supabase
        .from('public_characters')
        .delete()
        .eq('char_uuid', initialCharacter.char_uuid);

      if (publicDeleteError && publicDeleteError.code !== 'PGRST116') {
        throw publicDeleteError;
      }

      if (!publicDeleteError) {
        showAlert('Character deleted successfully!', 'Success');
        onClose();
        return;
      }

      const { error: privateDeleteError } = await supabase
        .from('private_characters')
        .delete()
        .eq('char_uuid', initialCharacter.char_uuid);

      if (privateDeleteError) {
        throw privateDeleteError;
      }

      showAlert('Character deleted successfully!', 'Success');
      onClose();
    } catch (error) {
      console.error('Error deleting character:', error);
      Sentry.captureException(error);
      showAlert('Error deleting character.', 'Alert');
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
