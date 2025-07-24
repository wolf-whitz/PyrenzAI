import { Utils as utils } from '~/Utility';
import * as Sentry from '@sentry/react';
import { v4 as uuidv4 } from 'uuid';
import { handleSaveDraft } from '@components';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';

const requiredCharacterFields: (keyof Character)[] = [
  'title',
  'persona',
  'name',
  'model_instructions',
  'scenario',
  'description',
  'first_message',
  'tags',
  'gender',
  'creator',
  'profile_image',
  'attribute'
];

const validateCharacterData = (character: Character) => {
  const missingFields = requiredCharacterFields.filter((field) => {
    const value = character[field];
    return (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  });
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

interface UserData {
  username: string;
}

export const fetchUserName = async (userUuid: string) => {
  try {
    const { data } = await utils.db.select<UserData>('user_data', '*', null, {
      user_uuid: userUuid,
    });
    if (!data || data.length === 0) return '';
    return data[0].username;
  } catch (error) {
    Sentry.captureException(error);
    return '';
  }
};

export const handleClearCharacter = (setCharacter: (c: Character) => void) => {
  setCharacter({
    title: '',
    persona: '',
    name: '',
    model_instructions: '',
    scenario: '',
    description: '',
    first_message: '',
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
    id: '',
  });
};

export const handleDeleteCharacter = async (
  character: Character,
  setCharacter: (c: Character) => void,
  showAlert: (msg: string, type: string) => void
) => {
  if (!character.char_uuid) {
    handleClearCharacter(setCharacter);
    showAlert('Character data cleared.', 'success');
  } else {
    try {
      await utils.db.delete('characters', { char_uuid: character.char_uuid });
      handleClearCharacter(setCharacter);
      showAlert('Character deleted successfully.', 'success');
    } catch (error) {
      Sentry.captureException(error);
      showAlert('Error deleting character.', 'alert');
    }
  }
};

export const handleSaveCharacter = async (
  character: Character,
  userUuid: string,
  setSaveLoading: (v: boolean) => void,
  showAlert: (msg: string, type: string) => void
) => {
  setSaveLoading(true);
  try {
    if (!userUuid) {
      showAlert('User UUID is missing.', 'Alert');
      setSaveLoading(false);
      return;
    }

    const validation = validateCharacterData(character);
    if (!validation.isValid) {
      showAlert(
        `Missing or undefined fields: ${validation.missingFields.join(', ')}`,
        'Alert'
      );
      setSaveLoading(false);
      return;
    }

    const char_uuid = uuidv4();
    const characterWithUUID: Character = {
      ...character,
      char_uuid,
    };
    const response = await handleSaveDraft(characterWithUUID, userUuid);

    if (!response.success) {
      showAlert(`Error saving draft: ${response.error}`, 'Alert');
    } else {
      showAlert('Draft saved successfully!', 'Success');
    }
  } finally {
    setSaveLoading(false);
  }
};

export const handleSubmitCharacter = async (
  e: React.FormEvent,
  character: Character,
  character_update: boolean,
  userUuid: string,
  setLoading: (b: boolean) => void,
  showAlert: (msg: string, type: string) => void,
  navigate: (url: string) => void,
  createCharacter: (
    char: Character
  ) => Promise<{
    char_uuid?: string;
    error?: string;
    is_moderated?: boolean;
    moderated_message?: string;
  }>,
  updateCharacter: (
    char: Character
  ) => Promise<{
    char_uuid?: string;
    error?: string;
    is_moderated?: boolean;
    moderated_message?: string;
  }>,
  CreateNewChat: (
    char_uuid: string,
    userUuid: string
  ) => Promise<{ chat_uuid?: string; error?: string }>
) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (!userUuid) {
      const result = { success: false, message: 'User UUID is missing.' };
      showAlert(result.message, 'Alert');
      setLoading(false);
      return result;
    }

    const validation = validateCharacterData(character);
    if (!validation.isValid) {
      const result = {
        success: false,
        message: `Missing or undefined fields: ${validation.missingFields.join(', ')}`,
      };
      showAlert(result.message, 'Alert');
      setLoading(false);
      return result;
    }

    let response;
    if (character_update) {
      response = await updateCharacter(character);
    } else {
      response = await createCharacter(character);
    }

    if (response.is_moderated) {
      const result = { success: false, message: response.moderated_message };
      useCharacterStore.getState().setError(result.message);
      showAlert(result.message, 'Alert');
      setLoading(false);
      return result;
    } else if (response.error) {
      Sentry.captureException(new Error(response.error));
      const result = {
        success: false,
        message: `Error creating/updating character: ${response.error}`,
      };
      useCharacterStore.getState().setError(result.message);
      showAlert(result.message, 'Alert');
      setLoading(false);
      return result;
    }

    const characterUuid = response.char_uuid;
    if (characterUuid) {
      const chatResponse = await CreateNewChat(characterUuid, userUuid);
      if (chatResponse.error) {
        Sentry.captureException(new Error(chatResponse.error));
        const result = {
          success: false,
          message: `Error creating chat: ${chatResponse.error}`,
        };
        useCharacterStore.getState().setError(result.message);
        showAlert(result.message, 'Alert');
        setLoading(false);
        return result;
      }

      const chatUuid = chatResponse.chat_uuid;
      if (chatUuid) {
        navigate(`/chat/${chatUuid}`);
        return {
          success: true,
          message: 'Character and chat created successfully.',
        };
      }

      const errorMsg = 'Chat created but no chat UUID returned.';
      Sentry.captureException(new Error(errorMsg));
      const result = { success: false, message: errorMsg };
      useCharacterStore.getState().setError(result.message);
      showAlert(result.message, 'Alert');
      setLoading(false);
      return result;
    }

    const errorMsg =
      'Character created/updated but no character UUID returned.';
    Sentry.captureException(new Error(errorMsg));
    const result = { success: false, message: errorMsg };
    useCharacterStore.getState().setError(result.message);
    showAlert(result.message, 'Alert');
    setLoading(false);
    return result;
  } catch (error) {
    Sentry.captureException(error);
    const result = { success: false, message: 'An unexpected error occurred.' };
    useCharacterStore.getState().setError(result.message);
    showAlert(result.message, 'Alert');
    setLoading(false);
    return result;
  } finally {
    setLoading(false);
  }
};
