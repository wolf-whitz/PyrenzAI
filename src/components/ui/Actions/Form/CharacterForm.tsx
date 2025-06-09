import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
} from '@components';
import { TextareaForm } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { useCreateAPI } from '@api';

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

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full flex flex-col space-y-6"
      >
        <TextareaForm   />
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
