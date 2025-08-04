import { motion } from 'framer-motion';
import { CircularProgress, Typography, Link } from '@mui/material';
import {
  SaveOutlined as SaveIcon,
  DescriptionOutlined as DescriptionIcon,
  DeleteOutlined as DeleteIcon,
  Mood as EmotionIcon,
} from '@mui/icons-material';
import { CreateButton, DraftsModal, Emotion } from '@components';
import { Draft } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCharacterStore } from '~/store';

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  onDelete: () => void;
  loading: boolean;
  saveLoading: boolean;
  onSelectDraft: (draft: Draft) => void;
  character_update: boolean;
}

export function FormActions({
  onClear,
  onSave,
  onDelete,
  loading,
  saveLoading,
  onSelectDraft,
  character_update,
}: FormActionsProps) {
  const navigate = useNavigate();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [emotionModalOpen, setEmotionModalOpen] = useState(false);
  const addEmotion = useCharacterStore((state) => state.addEmotion);

  const handleOpenDraftModal = () => setIsDraftModalOpen(true);
  const handleCloseDraftModal = () => setIsDraftModalOpen(false);
  const handleOpenEmotion = () => setEmotionModalOpen(true);
  const handleCloseEmotion = () => setEmotionModalOpen(false);
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

  return (
    <motion.div
      className="flex flex-wrap justify-end gap-2 mt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PyrenzBlueButton
        variant="contained"
        onClick={onClear}
        className="w-full sm:w-auto"
      >
        Clear
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={onSave}
        disabled={saveLoading}
        startIcon={
          saveLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SaveIcon />
          )
        }
        className="w-full sm:w-auto"
      >
        {saveLoading ? 'Saving...' : 'Save'}
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleOpenDraftModal}
        startIcon={<DescriptionIcon />}
        className="w-full sm:w-auto"
      >
        Drafts
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        onClick={handleOpenEmotion}
        startIcon={<EmotionIcon />}
        className="w-full sm:w-auto"
      >
        Add Emotion
      </PyrenzBlueButton>
      {character_update && (
        <PyrenzBlueButton
          variant="contained"
          color="error"
          onClick={onDelete}
          startIcon={<DeleteIcon />}
          className="w-full sm:w-auto"
        >
          Delete
        </PyrenzBlueButton>
      )}
      <CreateButton
        loading={loading}
        className="w-full sm:w-auto"
        character_update={character_update}
      />
      {isDraftModalOpen && (
        <DraftsModal onClose={handleCloseDraftModal} onSelect={onSelectDraft} />
      )}
      {emotionModalOpen && (
        <Emotion
          open={emotionModalOpen}
          onClose={handleCloseEmotion}
          onSave={handleSaveEmotion}
        />
      )}
      <Typography
        variant="body1"
        align="center"
        sx={{ width: '100%', marginTop: '16px', color: 'grey.600' }}
      >
        <Link
          component="button"
          variant="body1"
          onClick={handleGuideClick}
          sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'inherit',
            background: 'none',
            border: 0,
            p: 0,
          }}
        >
          Not sure where to start? Check out our starter guide! ദ്ദി(ᵔᗜᵔ)
        </Link>
      </Typography>
    </motion.div>
  );
}
