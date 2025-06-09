import {
  GetUserUUID,
  CreateNewChat,
  createCharacter,
  updateCharacter,
  handleSaveDraft,
} from '@components';
import { useState, useEffect } from 'react';
import { useCharacterStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { Character, Draft } from '@shared-types';
import { usePyrenzAlert } from '~/provider';
import { v4 as uuidv4 } from 'uuid';

export const useCreateAPI = (
  navigate: (path: string) => void,
  character_update: boolean
) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  const Character = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    const fetchUserUuid = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUuid(uuid);
        if (uuid) {
          const name = await fetchUserName(uuid);
          setCharacter({ creator: name });
        }
      } catch (error) {
        console.error('Error fetching user UUID:', error);
        Sentry.captureException(error);
      }
    };

    fetchUserUuid();
  }, [setCharacter]);

  const tags = Array.isArray(Character.tags)
    ? Character.tags
    : (Character.tags as string).split(',').map((tag: string) => tag.trim());

  const fetchUserName = async (userUuid: string): Promise<string> => {
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

    return data.username || '';
  };

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCharacter({ profile_image: blobUrl });
    }
  };

  const character: Character = {
    persona: Character.persona,
    name: Character.name,
    model_instructions: Character.model_instructions,
    scenario: Character.scenario,
    description: Character.description,
    first_message: Character.first_message,
    tags: tags,
    gender: Character.gender,
    creator: Character.creator || '',
    is_public: Character.is_public,
    is_nsfw: Character.is_nsfw,
    profile_image: Character.profile_image || '',
    creator_uuid: userUuid || '',
    char_uuid: Character.char_uuid || '',
  };

  const handleClear = () => {
    setCharacter({
      persona: '',
      name: '',
      model_instructions: '',
      scenario: '',
      description: '',
      first_message: '',
      tags: [],
      gender: '',
      creator: '',
      is_public: false,
      is_nsfw: false,
      profile_image: '',
    });
    URL.revokeObjectURL(Character.profile_image ?? '');
  };

  const handleDelete = async () => {
    if (!Character.char_uuid) {
      handleClear();
      showAlert('Character data cleared.', 'success');
    } else {
      try {
        const { error } = await supabase
          .from('characters')
          .delete()
          .eq('char_uuid', Character.char_uuid);

        if (error) {
          console.error('Error deleting character:', error);
          Sentry.captureException(error);
          showAlert('Error deleting character.', 'alert');
        } else {
          handleClear();
          showAlert('Character deleted successfully.', 'success');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        Sentry.captureException(error);
        showAlert('Unexpected error occurred while deleting character.', 'alert');
      }
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      if (!userUuid) {
        alert('User UUID is missing.');
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
        alert(`Error saving draft: ${response.error}`);
      } else {
        alert('Saved');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSelectDraft = (draft: Draft) => {
    setCharacter(draft);
  };

  const handleImportCharacter = (data: Character | null) => {
    if (!data) {
      console.error('No data provided to import character.');
      return;
    }

    setCharacter({ ...data });
    console.log('Character Uploaded', useCharacterStore.getState());
  };

  const handleSubmit = async (
    e: React.FormEvent,
    character_update: boolean
  ) => {
    e.preventDefault();
    setLoading(true);

    const fieldsToCheck = [
      Character.persona,
      Character.model_instructions,
      Character.scenario,
      Character.description,
      Character.first_message,
      Character.creator,
      Character.gender,
      Character.profile_image,
    ];

    const isValid = fieldsToCheck.every((field) => field && field.length >= 2);

    if (!isValid) {
      showAlert(
        'Each field must be at least 2 characters long (excluding tags). Please make sure the checkbox is selected and a gender is chosen from the dropdown.',
        'Alert'
      );
      setLoading(false);
      return;
    }

    try {
      if (!userUuid) {
        alert('User UUID is missing.');
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
      } else {
        const characterUuid = response.char_uuid;
        if (characterUuid) {
          const chatResponse = await CreateNewChat(characterUuid, userUuid);
          if (chatResponse.error) {
            console.error('Error creating chat:', chatResponse.error);
            Sentry.captureException(new Error(chatResponse.error));
          } else {
            const chatUuid = chatResponse.chat_uuid;
            if (chatUuid) {
              navigate(`/chat/${chatUuid}`);
            } else {
              console.error('Chat created but no chat UUID returned.');
              Sentry.captureException(
                new Error('Chat created but no chat UUID returned.')
              );
            }
          }
        } else {
          console.error(
            'Character created/updated but no character UUID returned.'
          );
          Sentry.captureException(
            new Error(
              'Character created/updated but no character UUID returned.'
            )
          );
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const formState = {
    ...character,
  };

  return {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    setShowRequiredFieldsPopup,
    Character,
    character,
    setCharacter,
    handleClear,
    handleSave,
    handleDelete, 
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit: (e: React.FormEvent) => handleSubmit(e, character_update),
    formState,
    handleImageSelect,
  };
};
