import React, { useRef } from 'react';
import {
  GenderDropdown,
  VisibilityDropdown,
  TokenSummary,
  FormActions,
  useCreateAPI,
} from '@components';
import { TextareaForm, TextareaFormHandle } from './Childrens/TextareaForm';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
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
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const textareaFormRef = useRef<TextareaFormHandle>(null);

  const {
    loading,
    saveLoading,
    handleDelete,
    handleSelectDraft,
    handleSubmit,
  } = useCreateAPI(navigate, character_update, user_uuid, creator);

  const error = useCharacterStore((state) => state.error);

  const handleClear = () => {
    textareaFormRef.current?.clearAllCategories();
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={3}
        component="form"
        onSubmit={(e) => handleSubmit(character_update ? 'Update' : 'Create', e)}
        sx={{
          backgroundColor: 'rgba(30, 30, 30, 0.75)',
          backdropFilter: 'blur(6px)',
          borderRadius: 3,
          width: '100%',
          maxWidth: { xs: '100%', sm: '640px', md: '700px' },
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          boxShadow: '0 0 16px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Typography
          variant={isMdUp ? 'h5' : 'h6'}
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
          <TextareaForm onClear={() => textareaClear?.()} />
          <GenderDropdown />
          <VisibilityDropdown />
          <TokenSummary />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <FormActions
            onClear={() => textareaClear?.()}
            onCreate={() => handleSubmit(character_update ? 'Update' : 'Create')}
            onSave={() => handleSubmit('Draft')}
            onDelete={handleDelete}
            saveLoading={saveLoading}
            loading={loading}
            onSelectDraft={handleSelectDraft}
            character_update={character_update}
          />
        </Box>
      </Paper>
    </Box>
  );
}
