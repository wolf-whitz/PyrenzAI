import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress, Typography } from '@mui/material';
import { CreateButton, DraftsModal, ImportCharacterModal } from '@components';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CharacterData, Draft } from '@shared-types/CharacterProp';
import { PyrenzBlueButton } from '~/theme';

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  loading: boolean;
  saveLoading: boolean;
  onSelectDraft: (draft: Draft) => void;
  onImportCharacter: (data: CharacterData | null) => void;
}

export function FormActions({
  onClear,
  onSave,
  loading,
  saveLoading,
  onSelectDraft,
  onImportCharacter,
}: FormActionsProps) {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isImportCharacterModalOpen, setIsImportCharacterModalOpen] =
    useState(false);

  const handleOpenDraftModal = () => {
    setIsDraftModalOpen(true);
  };

  const handleCloseDraftModal = () => {
    setIsDraftModalOpen(false);
  };

  const handleOpenImportCharacterModal = () => {
    setIsImportCharacterModalOpen(true);
  };

  const handleCloseImportCharacterModal = () => {
    setIsImportCharacterModalOpen(false);
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
            <SaveIcon className="text-xl" />
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
        startIcon={<DescriptionIcon className="text-xl" />}
      >
        Drafts
      </PyrenzBlueButton>
      <PyrenzBlueButton
        variant="contained"
        color="primary"
        onClick={handleOpenImportCharacterModal}
        className="w-full sm:w-auto"
        startIcon={<UploadFileIcon className="text-xl" />}
      >
        Import Character
      </PyrenzBlueButton>
      <CreateButton loading={loading} className="w-full sm:w-auto" />
      {isDraftModalOpen && (
        <DraftsModal onClose={handleCloseDraftModal} onSelect={onSelectDraft} />
      )}
      {isImportCharacterModalOpen && (
        <ImportCharacterModal
          onClose={handleCloseImportCharacterModal}
          onImport={onImportCharacter}
        />
      )}
      <Typography
        variant="body1"
        align="center"
        sx={{ width: '100%', marginTop: '16px', color: 'grey.600' }}
      >
        Not sure where to start? Check out our starter guide! ദ്ദി(ᵔᗜᵔ){' '}
      </Typography>
    </motion.div>
  );
}
