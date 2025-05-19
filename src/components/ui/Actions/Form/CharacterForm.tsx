import React, { useState, useEffect } from 'react';
import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
  RequiredFieldsPopup,
} from '@components';
import { TextareaForm } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { useCreateAPI } from '@api';

export function CharacterForm() {
  const navigate = useNavigate();
  const {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    missingFields,
    characterData,
    handleDropdownChange,
    handleChange,
    handleClear,
    handleSave,
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit,
    formState,
    setShowRequiredFieldsPopup,
  } = useCreateAPI(navigate);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(showRequiredFieldsPopup);
  }, [showRequiredFieldsPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowRequiredFieldsPopup(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full flex flex-col space-y-6"
      >
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
      {showPopup && (
        <RequiredFieldsPopup
          missingFields={missingFields}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
