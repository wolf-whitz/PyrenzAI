import { supabase } from '~/Utility';
import * as Sentry from '@sentry/react';
import { Character, Draft } from '@shared-types';
import { v4 as uuidv4 } from 'uuid';
import { handleSaveDraft } from '@components';

const requiredCharacterFields: Array<keyof Character> = [
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
];

const validateCharacterData = (character: Character) => {
  const missingFields = requiredCharacterFields.filter((field) => {
    const value = character[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export const fetchUserName = async (userUuid: string): Promise<string> => {
  const { data, error } = await supabase
    .from('user_data')
    .select('username')
    .eq('user_uuid', userUuid)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    Sentry.captureException(error);
    return '';
  }

  return data.username;
};

export const handleClearCharacter = (setCharacter: any) => {
  setCharacter({
    persona: '',
    name: '',
    model_instructions: '',
    scenario: '',
    description: '',
    first_message: '',
    tags: '',
    gender: '',
    creator: '',
    is_public: false,
    is_nsfw: false,
    profile_image: '',
  });
};

export const handleDeleteCharacter = async (
  character: Character,
  setCharacter: any,
  showAlert: any
) => {
  if (!character.char_uuid) {
    handleClearCharacter(setCharacter);
    showAlert('Character data cleared.', 'success');
  } else {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('char_uuid', character.char_uuid);

      if (error) {
        console.error('Error deleting character:', error);
        Sentry.captureException(error);
        showAlert('Error deleting character.', 'alert');
      } else {
        handleClearCharacter(setCharacter);
        showAlert('Character deleted successfully.', 'success');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Sentry.captureException(error);
      showAlert('Unexpected error occurred while deleting character.', 'alert');
    }
  }
};

export const handleSaveCharacter = async (
  character: Character,
  userUuid: string | null,
  setSaveLoading: any,
  showAlert: any
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
    const characterWithUUID = {
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
  userUuid: string | null,
  setLoading: any,
  showAlert: any,
  navigate: (path: string) => void,
  createCharacter: any,
  updateCharacter: any,
  CreateNewChat: any
) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!userUuid) {
      showAlert('User UUID is missing.', 'Alert');
      setLoading(false);
      return;
    }

    const validation = validateCharacterData(character);
    if (!validation.isValid) {
      showAlert(
        `Missing or undefined fields: ${validation.missingFields.join(', ')}`,
        'Alert'
      );
      setLoading(false);
      return;
    }

    let response;
    if (character_update) {
      response = await updateCharacter(character);
    } else {
      response = await createCharacter(character);
    }

    if (response.error) {
      console.error('Error creating/updating character:', response.error);
      Sentry.captureException(new Error(response.error));
      showAlert(
        `Error creating/updating character: ${response.error}`,
        'Alert'
      );
    } else {
      const characterUuid = response.char_uuid;
      if (characterUuid) {
        const chatResponse = await CreateNewChat(characterUuid, userUuid);
        if (chatResponse.error) {
          console.error('Error creating chat:', chatResponse.error);
          Sentry.captureException(new Error(chatResponse.error));
          showAlert(`Error creating chat: ${chatResponse.error}`, 'Alert');
        } else {
          const chatUuid = chatResponse.chat_uuid;
          if (chatUuid) {
            navigate(`/chat/${chatUuid}`);
          } else {
            console.error('Chat created but no chat UUID returned.');
            Sentry.captureException(
              new Error('Chat created but no chat UUID returned.')
            );
            showAlert('Chat created but no chat UUID returned.', 'Alert');
          }
        }
      } else {
        console.error(
          'Character created/updated but no character UUID returned.'
        );
        Sentry.captureException(
          new Error('Character created/updated but no character UUID returned.')
        );
        showAlert(
          'Character created/updated but no character UUID returned.',
          'Alert'
        );
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    showAlert('An unexpected error occurred.', 'Alert');
  } finally {
    setLoading(false);
  }
};
