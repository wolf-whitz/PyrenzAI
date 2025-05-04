import React, { useState } from 'react';
import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
  RequiredFieldsPopup,
  ImageUpload,
} from '~/components';
import TextareaForm from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { useCreateAPI } from '~/api/CreatePage/CreateAPI';

export default function CharacterForm() {
  const navigate = useNavigate();
  const {
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
  } = useCreateAPI(navigate);

  const [showPopup, setShowPopup] = useState(showRequiredFieldsPopup);

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
      {showPopup && (
        <RequiredFieldsPopup
          missingFields={missingFields}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
