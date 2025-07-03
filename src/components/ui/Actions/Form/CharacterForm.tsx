import {
  GenderDropdown,
  VisibilityCheckboxes,
  TokenSummary,
  FormActions,
} from '@components';
import { TextareaForm } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { useCreateAPI } from '@api';
import { Typography } from '@mui/material';

interface CharacterFormProps {
  character_update: boolean;
  user_uuid: string | null;
  creator: string | null;
}

export function CharacterForm({
  character_update,
  user_uuid,
  creator,
}: CharacterFormProps) {
  const navigate = useNavigate();
  const {
    loading,
    saveLoading,
    handleClear,
    handleSave,
    handleSelectDraft,
    handleSubmit,
    handleDelete,
  } = useCreateAPI(navigate, character_update, user_uuid, creator);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-full flex flex-col space-y-6"
      >
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          {character_update ? 'Update Mode' : 'Create Mode'}
        </Typography>
        <TextareaForm />
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
          character_update={character_update}
        />
      </form>
    </div>
  );
}
