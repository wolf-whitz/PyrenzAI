import { GetUserUUID, CreateNewChat, createCharacter, handleSaveDraft } from '@components';
import { useState, useEffect } from 'react';
import { useCharacterStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { CharacterData, Draft } from '@shared-types/CharacterProp';
import { PyrenzAlert } from '@components';

export const useCreateAPI = (navigate: (path: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  const characterData = useCharacterStore((state) => state);
  const setCharacterData = useCharacterStore((state) => state.setCharacterData);

  useEffect(() => {
    const fetchUserUuid = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUuid(uuid);
        if (uuid) {
          const name = await fetchUserName(uuid);
          setCharacterData({ creator: name });
        }
      } catch (error) {
        console.error('Error fetching user UUID:', error);
        Sentry.captureException(error);
      }
    };

    fetchUserUuid();
  }, [setCharacterData]);

  const tags = Array.isArray(characterData.tags)
    ? characterData.tags
    : (characterData.tags as string).split(',').map((tag: string) => tag.trim());

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
      setCharacterData({ profile_image: blobUrl });
    }
  };

  const character = {
    persona: characterData.persona,
    name: characterData.name,
    model_instructions: characterData.model_instructions,
    scenario: characterData.scenario,
    description: characterData.description,
    first_message: characterData.first_message,
    tags: tags,
    gender: characterData.gender,
    creator: characterData.creator,
    is_public: characterData.is_public,
    is_nsfw: characterData.is_nsfw,
    profile_image: characterData.profile_image || '',
    textarea_token: {},
    token_total: 0,
    creator_uuid: userUuid
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setCharacterData({ [name]: e.target.checked });
    } else {
      setCharacterData({ [name]: value });
    }
  };

  const handleClear = () => {
    const emptyData = {
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
      textarea_token: {},
      token_total: 0,
    };
    setCharacterData(emptyData);
    if (characterData.profile_image) {
      URL.revokeObjectURL(characterData.profile_image);
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

      const response = await handleSaveDraft(character, userUuid);

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
    setCharacterData({
      ...character
    });
  };

  const handleImportCharacter = (data: CharacterData | null) => {
    setCharacterData({
      ...character,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fieldsToCheck = [
      characterData.persona,
      characterData.model_instructions,
      characterData.scenario,
      characterData.description,
      characterData.first_message,
      characterData.gender
    ];

    const isValid = fieldsToCheck.every(field => field && field.length >= 5);

    if (!isValid) {
      PyrenzAlert('Each field must be at least 25 characters long. (Excluding tags)', 'Alert');
      setLoading(false);
      return;
    }

    try {
      if (!userUuid) {
        alert('User UUID is missing.');
        setLoading(false);
        return;
      }

      const response = await createCharacter(
          character,
      );

      if (response.error) {
        console.error('Error creating character:', response.error);
        Sentry.captureException(new Error(response.error));
      } else {
        const characterUuid = response.char_uuid;
        if (characterUuid) {
          const chatResponse = await CreateNewChat(
            characterUuid,
            userUuid,
            character.profile_image,
            character.description
          );
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
          console.error('Character created but no character UUID returned.');
          Sentry.captureException(
            new Error('Character created but no character UUID returned.')
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
    ...character
    };

  return {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    setShowRequiredFieldsPopup,
    characterData,
    character,
    setCharacterData,
    handleChange,
    handleClear,
    handleSave,
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit,
    formState,
    handleImageSelect,
  };
};
