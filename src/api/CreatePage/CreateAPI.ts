import { GetUserUUID, CreateNewChat } from '~/functions';
import { useState, useEffect } from 'react';
import { useUserStore, useCharacterStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { CharacterData, Draft, ApiResponse } from '@shared-types/CharacterProp';
import { Utils } from '~/Utility/Utility';

export const useCreateAPI = (navigate: (path: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  const characterData = useCharacterStore((state) => state);
  const setCharacterData = useCharacterStore((state) => state.setCharacterData);

  const requiredFields = [
    'persona',
    'name',
    'model_instructions',
    'scenario',
    'description',
    'first_message',
    'tags',
    'gender',
  ];

  useEffect(() => {
    const fetchUserUuid = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUuid(uuid);
      } catch (error) {
        console.error('Error fetching user UUID:', error);
        Sentry.captureException(error);
      }
    };

    fetchUserUuid();
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      if (userUuid) {
        const name = await fetchUserName(userUuid);
        setCharacterData({ creator: name });
      }
    };

    getUserName();
  }, [userUuid, setCharacterData]);

  const fetchUserName = async (userUuid: string): Promise<string> => {
    const { data, error } = await supabase
      .from('user_data')
      .select('persona_name, full_name')
      .eq('user_uuid', userUuid)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      Sentry.captureException(error);
      return '';
    }

    return data.persona_name || data.full_name || '';
  };

  const handleImageSelect = (file: File | null) => {};

  const handleDropdownChange = (value: string) => {
    setCharacterData({ gender: value });
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
    const emptyData: Omit<CharacterData, 'textarea_token' | 'token_total'> = {
      persona: '',
      name: '',
      model_instructions: '',
      scenario: '',
      description: '',
      first_message: '',
      tags: [],
      gender: '',
      is_public: false,
      is_nsfw: false,
      creator: '',
    };
    setCharacterData({ ...emptyData, textarea_token: {}, token_total: 0 });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      if (!userUuid) {
        alert('User UUID is missing.');
        setSaveLoading(false);
        return;
      }

      const tags = Array.isArray(characterData.tags)
        ? characterData.tags
        : (characterData.tags as string)
            .split(',')
            .map((tag: string) => tag.trim());

      const { data, error } = await supabase.from('draft_characters').upsert([
        {
          user_uuid: userUuid,
          ...characterData,
          tags,
        },
      ]);

      if (error) {
        alert('Error saving draft: ' + error.message);
        Sentry.captureException(error);
      } else {
        alert('Saved');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Sentry.captureException(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSelectDraft = (draft: Draft) => {
    const tags = Array.isArray(draft.tags)
      ? draft.tags
      : (draft.tags as string).split(',').map((tag: string) => tag.trim());

    setCharacterData({
      persona: draft.persona,
      name: draft.name,
      model_instructions: draft.model_instructions,
      scenario: draft.scenario,
      description: draft.description,
      first_message: draft.first_message,
      tags,
      gender: draft.gender,
      is_public: draft.is_public,
      is_nsfw: draft.is_nsfw,
      textarea_token: draft.textarea_token,
      token_total: draft.token_total,
      creator: draft.creator,
    });
  };

  const handleImportCharacter = (data: CharacterData | null) => {
    if (data) {
      const tags = Array.isArray(data.tags)
        ? data.tags
        : (data.tags as string).split(',').map((tag: string) => tag.trim());

      setCharacterData({
        persona: data.persona || '',
        name: data.name || '',
        model_instructions: data.model_instructions || '',
        scenario: data.scenario || '',
        description: data.description || '',
        first_message: data.first_message || '',
        tags,
        gender: data.gender || '',
        is_public: data.is_public || false,
        is_nsfw: data.is_nsfw || false,
        textarea_token: data.textarea_token || {},
        token_total: data.token_total || 0,
        creator: data.creator || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check for missing required fields
    const missing = requiredFields.filter(
      (field) => !characterData[field as keyof CharacterData]
    );

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowRequiredFieldsPopup(true); // Trigger the popup
      setLoading(false);
      return;
    }

    const bannerImage = sessionStorage.getItem('Character_Create_Image_Banner');
    const profileImage = sessionStorage.getItem(
      'Character_Create_Image_Profile'
    );

    if (!bannerImage || !profileImage) {
      alert('Missing required item: Images');
      setLoading(false);
      return;
    }

    try {
      if (!userUuid) {
        alert('User UUID is missing.');
        setLoading(false);
        return;
      }

      const tags = Array.isArray(characterData.tags)
        ? characterData.tags
        : (characterData.tags as string)
            .split(',')
            .map((tag: string) => tag.trim());

      const response: ApiResponse = await Utils.post('/api/createCharacter', {
        ...characterData,
        tags,
        bannerImage,
        profileImage,
        user_uuid: userUuid,
      });

      if (response.error) {
        console.error('Error creating character:', response.error);
        Sentry.captureException(new Error(response.error));
      } else {
        const characterUuid = response.character_uuid;
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
    ...characterData,
    tags: Array.isArray(characterData.tags)
      ? characterData.tags.join(', ')
      : characterData.tags,
  };

  return {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    setShowRequiredFieldsPopup,
    missingFields,
    characterData,
    setCharacterData,
    handleImageSelect,
    handleDropdownChange,
    handleChange,
    handleClear,
    handleSave,
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit,
    formState,
  };
};
