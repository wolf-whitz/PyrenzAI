import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
} from '@components';
import { TextareaForm } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { useCreateAPI } from '@api';
import { useCharacterStore } from '~/store';

interface CharacterFormProps {
  character_update: boolean;
}

export function CharacterForm({ character_update }: CharacterFormProps) {
  const navigate = useNavigate();
  const {
    loading,
    saveLoading,
    handleClear,
    handleSave,
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit,
  } = useCreateAPI(navigate, character_update);

  const characterData = useCharacterStore((state) => state);
  const setCharacterData = useCharacterStore((state) => state.setCharacterData);

  
  const [formState, setFormState] = useState({
    char_uuid: '',
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
    profile_image: '',
    textarea_token: {},
    token_total: 0,
  });

  useEffect(() => {
    setFormState({
      char_uuid: characterData.char_uuid,
      persona: characterData.persona,
      name: characterData.name,
      model_instructions: characterData.model_instructions,
      scenario: characterData.scenario,
      description: characterData.description,
      first_message: characterData.first_message,
      tags: Array.isArray(characterData.tags)
        ? characterData.tags.join(', ')
        : characterData.tags,
      gender: characterData.gender,
      is_public: characterData.is_public,
      is_nsfw: characterData.is_nsfw,
      profile_image: characterData.profile_image || '',
      textarea_token: characterData.textarea_token,
      token_total: characterData.token_total,
    });
  }, [characterData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setCharacterData({ [name]: e.target.checked } as any);
    } else {
      setCharacterData({ [name]: value } as any);
    }
  };

  const handleFormChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target;
    const checked =
      type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : undefined;

    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    handleChange(event);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full flex flex-col space-y-6"
      >
        <TextareaForm formState={formState} handleChange={handleFormChange} />
        <GenderDropdown />
        <VisibilityCheckboxes />
        <TokenSummary />
        <FormActions
          onClear={handleClear}
          onSave={handleSave}
          loading={loading}
          saveLoading={saveLoading}
          onSelectDraft={handleSelectDraft}
          onImportCharacter={handleImportCharacter}
          character_update={character_update}
        />
      </form>
    </div>
  );
}
