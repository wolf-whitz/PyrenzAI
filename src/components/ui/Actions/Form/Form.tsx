import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress, Typography, Link } from '@mui/material';
import { CreateButton, DraftsModal } from '@components';
import {
  SaveOutlined as SaveIcon,
  DescriptionOutlined as DescriptionIcon,
  DeleteOutlined as DeleteIcon,
} from '@mui/icons-material';
import { Draft } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';
import { useNavigate } from 'react-router-dom';

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
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenDraftModal = () => {
    setIsDraftModalOpen(true);
  };

  const handleCloseDraftModal = () => {
    setIsDraftModalOpen(false);
  };

  const handleGuideClick = () => {
    navigate('/Docs');
  };

  return (
    <motion.div
      className="flex flex-wrap justify-end space-x-2 space-y-2 mt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PyrenzBlueButton
        variant="contained"
        onClick={onClear}
        className="w-full sm:w-auto"
        sx={{
          bgcolor: 'black',
          color: 'white',
          '&:hover': { bgcolor: 'gray.700' },
          '&:focus': { outline: 'none', ring: '2px solid gray.500' },
        }}
      >
        Clear
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        color="primary"
        onClick={onSave}
        disabled={saveLoading}
        className="w-full sm:w-auto"
        startIcon={
          saveLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SaveIcon />
          )
        }
      >
        {saveLoading ? 'Saving...' : 'Save'}
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        color="primary"
        onClick={handleOpenDraftModal}
        className="w-full sm:w-auto"
        startIcon={<DescriptionIcon />}
      >
        Drafts
      </PyrenzBlueButton>
      {character_update && (
        <PyrenzBlueButton
          variant="contained"
          color="error"
          onClick={onDelete}
          className="w-full sm:w-auto"
          startIcon={<DeleteIcon />}
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
      <Typography
        variant="body1"
        align="center"
        sx={{ width: '100%', marginTop: '16px', color: 'grey.600' }}
      >
        <Link
          component="button"
          variant="body1"
          onClick={handleGuideClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'inherit',
            textDecoration: 'underline',
          }}
        >
          Not sure where to start? Check out our starter guide! ദ്ദി(ᵔᗜᵔ)
        </Link>
      </Typography>
    </motion.div>
  );
}
