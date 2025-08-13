import { Utils as utils } from '~/Utility';
import * as Sentry from '@sentry/react';
import { v4 as uuidv4 } from 'uuid';
import { GetUserData } from '@components';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import {
  createCharacter,
  createDraft,
  updateCharacter,
} from '@components';

type ActionType = 'Create' | 'Update' | 'Draft';

export const fetchUserName = async (): Promise<string> => {
  try {
    const userData = await GetUserData();
    return userData?.username || '';
  } catch (error) {
    Sentry.captureException(error);
    return '';
  }
};

export const handleClearCharacter = (
  setCharacter: (c: Partial<Character>) => void
) => {
  setCharacter({
    title: '',
    persona: '',
    name: '',
    model_instructions: '',
    scenario: '',
    description: '',
    first_message: [],
    tags: [],
    gender: '',
    creator: '',
    profile_image: '',
    is_public: false,
    is_nsfw: false,
    char_uuid: '',
    chat_messages_count: 0,
    is_owner: false,
    is_details_private: false,
    is_banned: false,
    isLoading: false,
    creator_uuid: '',
    lorebook: '',
    id: undefined,
  });
};

export const handleDeleteCharacter = async (
  character: Character,
  setCharacter: (c: Partial<Character>) => void,
  showAlert: (msg: string, type: string) => void
) => {
  if (!character.char_uuid) {
    handleClearCharacter(setCharacter);
    showAlert('Character data cleared.', 'success');
    return;
  }
  try {
    await utils.db.remove({
      tables: 'characters',
      match: { char_uuid: character.char_uuid },
    });
    handleClearCharacter(setCharacter);
    showAlert('Character deleted successfully.', 'success');
  } catch (error) {
    Sentry.captureException(error);
    showAlert('Error deleting character.', 'alert');
  }
};

export const handleSubmitCharacter = async (
  character: Character,
  type: ActionType,
  userUuid: string,
  showAlert: (msg: string, type: string) => void,
  navigate: (url: string) => void,
  CreateNewChat: (
    char_uuid: string,
    userUuid: string
  ) => Promise<{ chat_uuid: string; error?: string }>
) => {
  const setError = useCharacterStore.getState().setError;
  try {
    if (!userUuid) {
      const msg = 'User UUID is missing.';
      showAlert(msg, 'alert');
      setError(msg);
      return;
    }
    const char_uuid = character.char_uuid || uuidv4();
    const characterWithUUID: Character = { ...character, char_uuid };
    let response: {
      error?: string;
      is_moderated?: boolean;
      moderated_message?: string;
      char_uuid?: string;
    };

    if (type === 'Draft') {
      response = await createDraft(characterWithUUID, userUuid);
    } else if (type === 'Create') {
      response = await createCharacter(characterWithUUID);
    } else {
      response = await updateCharacter(characterWithUUID);
    }

    if (response.error) {
      showAlert(response.error, 'alert');
      setError(response.error);
      return;
    }

    if (response.is_moderated) {
      const msg =
        response.moderated_message ||
        '⚠️ Your character triggered moderation filters. Please revise and try again.';
      showAlert(msg, 'alert');
      setError(msg);
      return;
    }

    if (!response.char_uuid && type !== 'Draft') {
      const msg = 'Character save failed. No UUID returned.';
      showAlert(msg, 'alert');
      setError(msg);
      return;
    }

    if (type === 'Draft') {
      showAlert('Draft saved successfully!', 'success');
      setError(null);
      return;
    }

    if ((type === 'Create' || type === 'Update') && CreateNewChat && navigate) {
      const chatResponse = await CreateNewChat(response.char_uuid, userUuid);
      if (chatResponse.error) {
        Sentry.captureException(new Error(chatResponse.error));
        showAlert('Error creating chat.', 'alert');
        setError(chatResponse.error);
        return;
      }
      if (chatResponse.chat_uuid) {
        setError(null);
        navigate(`/chat/${chatResponse.chat_uuid}`);
      }
      const successMessage = type === 'Create'
        ? 'Chat created successfully.'
        : 'Character updated successfully!';
      showAlert(successMessage, 'success');
      setError(null);
    }
  } catch (error: any) {
    const msg = error?.message || 'An unexpected error occurred.';
    Sentry.captureException(error);
    showAlert(msg, 'alert');
    setError(msg);
  }
};
