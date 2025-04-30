import React, { useState } from 'react';
import { Utils } from '~/Utility/Utility';
import { useUserStore } from '~/store';
import { useCharacterStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
  RequiredFieldsPopup,
  ImageUpload,
} from '~/components';
import TextareaForm from "./Childrens/TextareaForm";
import posthog from 'posthog-js';

interface CharacterData {
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  tags: string;
  gender: string;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: { [key: string]: number };
  token_total: number;
}

interface Draft {
  id: number;
  user_uuid: string;
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  tags: string;
  gender: string;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: { [key: string]: number };
  token_total: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data?: any;
  error?: any;
}

export default function CharacterForm() {
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
    setCharacterData({ ...emptyData, textarea_token: {} });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const { data, error } = await supabase
        .from('draft_characters')
        .upsert([{
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
          token_total: characterData.token_total
        }]);

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
      tags: draft.tags,
      gender: draft.gender,
      is_public: draft.is_public,
      is_nsfw: draft.is_nsfw,
      textarea_token: draft.textarea_token,
      token_total: draft.token_total,
    });
  };

  const handleImportCharacter = () => {
    // Implement the logic to handle character import
    console.log('Import Character button clicked');
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
        console.log('Character created:', response.data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      posthog.capture('Unexpected error creating character', {
        error: errorMessage,
        user_uuid,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
      >
        <ImageUpload onImageSelect={handleImageSelect} />
        <TextareaForm
          formState={characterData}
          handleChange={handleChange}
        />
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
