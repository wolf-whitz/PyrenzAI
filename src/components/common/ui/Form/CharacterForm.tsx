import React, { useState } from 'react';
import { Utils } from '~/Utility/Utility';
import { useUserStore, useCharacterStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
  RequiredFieldsPopup,
  ImageUpload,
} from '~/components';
import TextareaForm from './Childrens/TextareaForm';
import posthog from 'posthog-js';
import { CharacterData, Draft, ApiResponse } from '@shared-types/CharacterProp';
import { useNavigate } from 'react-router-dom';

export default function CharacterForm() {
  const navigate = useNavigate();
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
    };
    setCharacterData({ ...emptyData, textarea_token: {}, token_total: 0 });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const { data, error } = await supabase.from('draft_characters').upsert([
        {
          user_uuid,
          persona: characterData.persona,
          name: characterData.name,
          model_instructions: characterData.model_instructions,
          scenario: characterData.scenario,
          description: characterData.description,
          first_message: characterData.first_message,
          tags: characterData.tags,
          gender: characterData.gender,
          is_public: characterData.is_public,
          is_nsfw: characterData.is_nsfw,
          textarea_token: characterData.textarea_token,
          token_total: characterData.token_total,
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

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
      >
        <ImageUpload onImageSelect={handleImageSelect} />
        <TextareaForm formState={formState} handleChange={handleChange} />
        <GenderDropdown
          value={characterData.gender}
          onChange={handleDropdownChange}
        />
        <VisibilityCheckboxes
          isPublic={characterData.is_public}
          isNSFW={characterData.is_nsfw}
          handleChange={handleChange}
        />
        <TokenSummary tokenTotal={characterData.token_total} />
        <FormActions
          onClear={handleClear}
          onSave={handleSave}
          loading={loading}
          saveLoading={saveLoading}
          onSelectDraft={handleSelectDraft}
          onImportCharacter={handleImportCharacter}
        />
      </form>
      {showRequiredFieldsPopup && (
        <RequiredFieldsPopup
          missingFields={missingFields}
          onClose={() => setShowRequiredFieldsPopup(false)}
        />
      )}
    </div>
  );
}
