import { Utils as utils } from '~/Utility';
import * as Sentry from '@sentry/react';
import { v4 as uuidv4 } from 'uuid';
import { handleSaveDraft, GetUserData } from '@components';
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
  'attribute',
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

export const fetchUserName = async (userUuid: string) => {
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
  } else {
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
  }
};

export const handleSaveCharacter = async (
  character: Character,
  userUuid: string,
  setSaveLoading: (v: boolean) => void,
  showAlert: (msg: string, type: string) => void
) => {
  const setError = useCharacterStore.getState().setError;
  setSaveLoading(true);
  try {
    if (!userUuid) {
      const msg = 'User UUID is missing.';
      showAlert(msg, 'Alert');
      setError(msg);
      return;
    }
    const validation = validateCharacterData(character);
    if (!validation.isValid) {
      const msg = `Missing or undefined fields: ${validation.missingFields.join(', ')}`;
      showAlert(msg, 'Alert');
      setError(msg);
      return;
    }
    const char_uuid = uuidv4();
    const characterWithUUID: Character = {
      ...character,
      char_uuid,
    };
    await handleSaveDraft(characterWithUUID, userUuid);
    showAlert('Draft saved successfully!', 'Success');
    setError(null);
  } catch (err: any) {
    const msg = err?.message || 'Unexpected error while saving character.';
    setError(msg);
    Sentry.captureException(err);
    showAlert('Failed to save draft.', 'Alert');
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
  createCharacter: (char: Character) => Promise<{
    char_uuid?: string;
    error?: string;
    is_moderated?: boolean;
    moderated_message?: string;
  }>,
  updateCharacter: (char: Character) => Promise<{
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
  const setError = useCharacterStore.getState().setError;
  setLoading(true);
  try {
    if (!userUuid) {
      const msg = 'User UUID is missing.';
      showAlert(msg, 'Alert');
      setError(msg);
      return;
    }

    const validation = validateCharacterData(character);
    if (!validation.isValid) {
      const msg = `Missing or undefined fields: ${validation.missingFields.join(', ')}`;
      showAlert(msg, 'Alert');
      setError(msg);
      return;
    }

    let response = character_update
      ? await updateCharacter(character)
      : await createCharacter(character);

    if (response.error) {
      showAlert(response.error, 'Alert');
      setError(response.error);
      return;
    }

    if (response.is_moderated) {
      const msg =
        response.moderated_message ||
        '⚠️ Your character triggered moderation filters. Please revise and try again.';
      showAlert(msg, 'Alert');
      setError(msg);
      return;
    }

    if (!response.char_uuid) {
      const msg = 'Character creation failed. No UUID returned.';
      showAlert(msg, 'Alert');
      setError(msg);
      return;
    }

    const chatResponse = await CreateNewChat(response.char_uuid, userUuid);

    if (chatResponse.error) {
      const msg = chatResponse.error;
      Sentry.captureException(new Error(msg));
      showAlert('Error creating chat.', 'Alert');
      setError(msg);
      return;
    }

    if (chatResponse.chat_uuid) {
      setError(null);
      navigate(`/chat/${chatResponse.chat_uuid}`);
    } else {
      showAlert('Chat created successfully.', 'Success');
      setError(null);
    }
  } catch (error: any) {
    const msg = error?.message || 'An unexpected error occurred.';
    Sentry.captureException(error);
    showAlert(msg, 'Alert');
    setError(msg);
  } finally {
    setLoading(false);
  }
};
