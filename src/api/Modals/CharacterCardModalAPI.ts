import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePyrenzAlert } from '~/provider';
import { GetUserUUID, CreateNewChat } from '@components';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types'


interface UseCharacterModalApiProps {
  character: Character | null;
  isOwner: boolean;
  onClose: () => void;
}

export const useCharacterModalApi = ({ character, isOwner, onClose }: UseCharacterModalApiProps) => {
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

  const handleCreatorClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (character?.creator_uuid) {
        navigate(`/profile/${character.creator_uuid}`);
      }
    },
    [character?.creator_uuid, navigate]
  );

  const handleChatNow = async () => {
    if (isLoading || !character?.char_uuid) return;

    if (!userUUID) {
      showAlert('You need to be logged in to chat with a bot.', 'Alert');
      return;
    }

    setIsLoading(true);

    try {
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

  const handleEditCharacter = () => {
    if (character) {
      navigate(`/create/${character.char_uuid}`, {
        state: { character, isOwner },
      });
    }
  };

  const handleDeleteCharacter = async () => {
    if (!character?.char_uuid) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('char_uuid', character.char_uuid);

      if (error) throw error;

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

  const tags = character ? ensureArray(character.tags).slice(0, 5) : [];

  return {
    isLoading,
    userUUID,
    handleCreatorClick,
    handleChatNow,
    handleEditCharacter,
    handleDeleteCharacter,
    tags,
  };
};

const ensureArray = (tags: string | string[] | null | undefined) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags);
    } catch (e) {
      console.error("Error parsing tags:", e);
      return [];
    }
  }
  return [];
};
