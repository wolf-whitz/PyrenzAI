import { useState, useEffect } from 'react';
import { useUserStore, useCharacterStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
import posthog from 'posthog-js';
import { CharacterData, Draft, ApiResponse } from '@shared-types/CharacterProp';
import { Utils } from '~/Utility/Utility';

export const useCreateAPI = (navigate: (path: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const characterData = useCharacterStore((state) => state);
  const setCharacterData = useCharacterStore((state) => state.setCharacterData);

  const user_uuid = useUserStore((state) => state.user_uuid);
  const auth_key = useUserStore((state) => state.auth_key);

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
    const getUserName = async () => {
      if (user_uuid) {
        const name = await fetchUserName(user_uuid);
        setCharacterData({ creator: name });
      }
    };

    getUserName();
  }, [user_uuid, setCharacterData]);

  const fetchUserName = async (user_uuid: string): Promise<string> => {
    const { data, error } = await supabase
      .from('user_data')
      .select('persona_name, full_name')
      .eq('user_uuid', user_uuid)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
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
      tags: '',
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
      const { data, error } = await supabase.from('draft_characters').upsert([
        {
          user_uuid,
          ...characterData,
        },
      ]);

      if (error) {
        alert('Error saving draft: ' + error.message);
        posthog.capture('Error saving draft', {
          error: error.message,
          user_uuid,
        });
      } else {
        alert('Saved');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      posthog.capture('Unexpected error saving draft', {
        error: errorMessage,
        user_uuid,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSelectDraft = (draft: Draft) => {
    setCharacterData({
      persona: draft.persona,
      name: draft.name,
      model_instructions: draft.model_instructions,
      scenario: draft.scenario,
      description: draft.description,
      first_message: draft.first_message,
      tags: Array.isArray(draft.tags) ? draft.tags.join(', ') : draft.tags,
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
      const tags = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags;

      setCharacterData({
        persona: data.persona || '',
        name: data.name || '',
        model_instructions: data.model_instructions || '',
        scenario: data.scenario || '',
        description: data.description || '',
        first_message: data.first_message || '',
        tags: tags,
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

    const missing = requiredFields.filter(
      (field) => !characterData[field as keyof CharacterData]
    );

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowRequiredFieldsPopup(true);
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
      const response: ApiResponse = await Utils.post('/api/createCharacter', {
        ...characterData,
        tags: characterData.tags,
        bannerImage,
        profileImage,
        user_uuid: user_uuid,
        auth_key: auth_key,
      });

      if (response.error) {
        console.error('Error creating character:', response.error);
        posthog.capture('Error creating character', {
          error: response.error,
          user_uuid,
        });
      } else {
        const chatUuid = response.chat?.chat_uuid;
        if (chatUuid) {
          navigate(`/chat/${chatUuid}`);
        } else {
          alert('Character created but no chat UUID returned.');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      posthog.capture('Unexpected error creating character', {
        error: errorMessage,
        user_uuid,
      });
    } finally {
      setLoading(false);
    }
  };

  const tagsAsString = Array.isArray(characterData.tags)
    ? characterData.tags.join(', ')
    : characterData.tags;

  const formState = {
    ...characterData,
    tags: tagsAsString,
  };

  return {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
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
