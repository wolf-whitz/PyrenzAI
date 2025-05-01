import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, CircularProgress } from '@mui/material';
import { CreateButton, DraftsModal, ImportCharacterModal } from '~/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { CharacterData, Draft } from '@shared-types/CharacterProp';

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  loading: boolean;
  saveLoading: boolean;
  onSelectDraft: (draft: Draft) => void;
  onImportCharacter: (data: CharacterData | null) => void;
}

export default function FormActions({
  onClear,
  onSave,
  loading,
  saveLoading,
  onSelectDraft,
  onImportCharacter
}: FormActionsProps) {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isImportCharacterModalOpen, setIsImportCharacterModalOpen] = useState(false);

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
      <Button
        variant="contained"
        onClick={onClear}
        className="w-full sm:w-auto"
        sx={{
          bgcolor: 'black',
          color: 'white',
          '&:hover': { bgcolor: 'gray.700' },
          '&:focus': { outline: 'none', ring: '2px solid gray.500' }
        }}
      >
        Clear
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        disabled={saveLoading}
        className="w-full sm:w-auto"
        startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <FontAwesomeIcon icon={faSave} />}
      >
        {saveLoading ? 'Saving...' : 'Save'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDraftModal}
        className="w-full sm:w-auto"
        startIcon={<FontAwesomeIcon icon={faFileAlt} />}
      >
        Drafts
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenImportCharacterModal}
        className="w-full sm:w-auto"
        startIcon={<FontAwesomeIcon icon={faUpload} />}
      >
        Import Character
      </Button>
      <CreateButton loading={loading} className="w-full sm:w-auto" />
      {isDraftModalOpen && (
        <DraftsModal onClose={handleCloseDraftModal} onSelect={onSelectDraft} />
      )}
      {isImportCharacterModalOpen && (
        <ImportCharacterModal onClose={handleCloseImportCharacterModal} onImport={onImportCharacter} />
      )}
    </motion.div>
  );
}
