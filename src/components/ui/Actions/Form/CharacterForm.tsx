import { CreatePageLoader } from '@components';
import React, { useState, useEffect } from 'react';
import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
} from '@components';
import { TextareaForm } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { useCreateAPI } from '@api';
import { ChangeEvent } from 'react';
import { useCharacterStore } from '~/store';
import { CharacterData } from '@shared-types/CharacterProp';

interface CharacterFormProps {
  characterData: CharacterData | undefined;
  isDataLoaded: boolean;
}

export function CharacterForm({ characterData, isDataLoaded }: CharacterFormProps) {
  const navigate = useNavigate();
  const {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    handleChange: apiHandleChange,
    handleClear,
    handleSave,
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit,
  } = useCreateAPI(navigate);

  const setCharacterData = useCharacterStore((state) => state.setCharacterData);
  const [showPopup, setShowPopup] = useState(showRequiredFieldsPopup);

  const [formState, setFormState] = useState({
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

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (characterData && !isInitialized && isDataLoaded) {
      const tagsString = Array.isArray(characterData.tags)
        ? characterData.tags.join(', ')
        : characterData.tags;

      setFormState({
        ...characterData,
        tags: tagsString,
        persona: characterData.persona || '',
        model_instructions: characterData.model_instructions || '',
        scenario: characterData.scenario || '',
        first_message: characterData.first_message || '',
        profile_image: characterData.profile_image || '',
        textarea_token: characterData.textarea_token || {}, // Ensure textarea_token is an object
      });

      setIsInitialized(true);
    }
  }, [characterData, isDataLoaded, isInitialized]);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;

    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    apiHandleChange(event);
  };

  const handleDropdownChange = (value: string) => {
    setCharacterData({ gender: value });
    setFormState(prevState => ({
      ...prevState,
      gender: value,
    }));
  };

  const updateTokenTotal = (total: number) => {
    setFormState(prevState => ({
      ...prevState,
      token_total: total,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full flex flex-col space-y-6"
      >
        <TextareaForm formState={formState} handleChange={handleFormChange} />
        <GenderDropdown
          value={formState.gender}
          onChange={handleDropdownChange}
        />
        <VisibilityCheckboxes
          isPublic={formState.is_public}
          isNSFW={formState.is_nsfw}
          handleChange={handleFormChange}
        />
        <TokenSummary updateTokenTotal={updateTokenTotal} />
        <FormActions
          onClear={handleClear}
          onSave={handleSave}
          loading={loading}
          saveLoading={saveLoading}
          onSelectDraft={handleSelectDraft}
          onImportCharacter={handleImportCharacter}
        />
      </form>
    </div>
  );
}
