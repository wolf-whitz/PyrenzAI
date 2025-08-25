import React, { useState } from 'react';
import { CircularProgress, Typography, Link, Box } from '@mui/material';
import {
  SaveOutlined as SaveIcon,
  DescriptionOutlined as DescriptionIcon,
  DeleteOutlined as DeleteIcon,
  Mood as EmotionIcon,
  ImportExportOutlined as ImportIcon,
  SmartToyOutlined as AssistantIcon,
} from '@mui/icons-material';
import { CreateButton, DraftsModal, Emotion, ImportModal, AssistantModal } from '@components';
import { CharacterPayload } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '~/store';

interface FormActionsProps {
  onClear: () => void;
  onCreate: () => void;
  onSave: () => void;
  onDelete: () => void;
  saveLoading: boolean;
  loading: boolean;
  onSelectDraft: (draft: CharacterPayload) => void;
  character_update: boolean;
}

export function FormActions({
  onClear,
  onCreate,
  onSave,
  onDelete,
  saveLoading,
  loading,
  onSelectDraft,
  character_update,
}: FormActionsProps) {
  const navigate = useNavigate();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [emotionModalOpen, setEmotionModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [clearPressed, setClearPressed] = useState(false);
  const [savePressed, setSavePressed] = useState(false);
  const [draftPressed, setDraftPressed] = useState(false);
  const [emotionPressed, setEmotionPressed] = useState(false);
  const [importPressed, setImportPressed] = useState(false);
  const [assistantPressed, setAssistantPressed] = useState(false);
  const [deletePressed, setDeletePressed] = useState(false);

  const addEmotion = useCharacterStore((state) => state.addEmotion);

  const handleOpenDraftModal = () => {
    setDraftPressed(true);
    setIsDraftModalOpen(true);
  };
  const handleCloseDraftModal = () => {
    setDraftPressed(false);
    setIsDraftModalOpen(false);
  };

  const handleOpenEmotion = () => {
    setEmotionPressed(true);
    setEmotionModalOpen(true);
  };
  const handleCloseEmotion = () => {
    setEmotionPressed(false);
    setEmotionModalOpen(false);
  };

  const handleOpenImportModal = () => {
    setImportPressed(true);
    setIsImportModalOpen(true);
  };
  const handleCloseImportModal = () => {
    setImportPressed(false);
    setIsImportModalOpen(false);
  };

  const handleOpenAssistantModal = () => {
    setAssistantPressed(true);
    setIsAssistantModalOpen(true);
  };
  const handleCloseAssistantModal = () => {
    setAssistantPressed(false);
    setIsAssistantModalOpen(false);
  };

  const handleGuideClick = () => navigate('/Docs');

  const handleSaveEmotion = (result: {
    triggerWords?: string[];
    imageUrl?: string;
    file: File | null;
  }) => {
    addEmotion({
      triggerWords: result.triggerWords || [],
      imageUrl: result.imageUrl || null,
      file: result.file ?? null,
    });
  };

  const handleClear = () => {
    setClearPressed(true);
    onClear();
    setClearPressed(false);
  };

  const handleSave = () => {
    setSavePressed(true);
    onSave();
    setSavePressed(false);
  };

  const handleDelete = () => {
    setDeletePressed(true);
    onDelete();
    setDeletePressed(false);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleClear}
        disabled={clearPressed || loading}
      >
        Clear
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleSave}
        disabled={saveLoading || savePressed || loading}
        startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
      >
        {saveLoading ? 'Saving...' : 'Save'}
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleOpenDraftModal}
        disabled={draftPressed || loading}
        startIcon={<DescriptionIcon />}
      >
        Drafts
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleOpenEmotion}
        disabled={emotionPressed || loading}
        startIcon={<EmotionIcon />}
      >
        Add Emotion
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleOpenImportModal}
        disabled={importPressed || loading}
        startIcon={<ImportIcon />}
      >
        Import
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleOpenAssistantModal}
        disabled={assistantPressed || loading}
        startIcon={<AssistantIcon />}
      >
        Assistant
      </PyrenzBlueButton>
      {character_update && (
        <PyrenzBlueButton
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={deletePressed || loading}
          startIcon={<DeleteIcon />}
        >
          Delete
        </PyrenzBlueButton>
      )}
      <CreateButton
        onClick={onCreate}
        character_update={character_update}
        disabled={loading}
      />
      {isDraftModalOpen && <DraftsModal onClose={handleCloseDraftModal} onSelect={onSelectDraft} />}
      {emotionModalOpen && <Emotion open={emotionModalOpen} onClose={handleCloseEmotion} onSave={handleSaveEmotion} />}
      {isImportModalOpen && <ImportModal open={isImportModalOpen} onClose={handleCloseImportModal} />}
      {isAssistantModalOpen && <AssistantModal open={isAssistantModalOpen} onClose={handleCloseAssistantModal} />}
      <Typography variant="body1" align="center" sx={{ width: '100%', mt: 2, color: 'grey.600' }}>
        <Link component="button" variant="body1" onClick={handleGuideClick} sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}>
          Not sure where to start? Check out our starter guide! ദ്ദി(ᵔᗜᵔ)
        </Link>
      </Typography>
    </Box>
  );
}
