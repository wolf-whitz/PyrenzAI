import {
  GenderDropdown,
  VisibilityDropdown,
  TokenSummary,
  FormActions,
  useCreateAPI,
} from '@components';
import { TextareaForm } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Alert } from '@mui/material';
import { useCharacterStore } from '~/store';

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
    handleDelete,
    handleSubmit,
  } = useCreateAPI(navigate, character_update, user_uuid, creator);

  const error = useCharacterStore((state) => state.error);

  return (
    <Box className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'rgba(30, 30, 30, 0.75)',
          backdropFilter: 'blur(6px)',
          borderRadius: 3,
          width: '100%',
          maxWidth: 700,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          boxShadow: '0 0 16px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#e5e5e5',
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}
        >
          {character_update ? 'Update Character' : 'Create Character'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ fontSize: '0.9rem' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextareaForm />
          <GenderDropdown />
          <VisibilityDropdown />
          <TokenSummary />
        </Box>

        <FormActions
          onClear={handleClear}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={loading}
          saveLoading={saveLoading}
          onSelectDraft={handleSelectDraft}
          character_update={character_update}
        />
      </Paper>
    </Box>
  );
}
