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
    handleDelete,  
  } = useCreateAPI(navigate, character_update);

  const Character = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);

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
      char_uuid: Character.char_uuid,
      persona: Character.persona,
      name: Character.name,
      model_instructions: Character.model_instructions,
      scenario: Character.scenario,
      description: Character.description,
      first_message: Character.first_message,
      tags: Array.isArray(Character.tags)
        ? Character.tags.join(', ')
        : Character.tags,
      gender: Character.gender,
      is_public: Character.is_public,
      is_nsfw: Character.is_nsfw,
      profile_image: Character.profile_image || '',
      textarea_token: Character.textarea_token,
      token_total: Character.token_total,
    });
  }, [Character]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setCharacter({ [name]: e.target.checked } as any);
    } else {
      setCharacter({ [name]: value } as any);
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
          onDelete={handleDelete}  
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
