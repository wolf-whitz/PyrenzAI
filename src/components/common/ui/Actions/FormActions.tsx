import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreateButton, DraftsModal, ImportCharacterModal } from '~/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';

interface Draft {
  id: number;
  user_uuid: string;
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  tags: string;
  gender: string;
  is_public: boolean;
  is_nsfw: boolean;
  textarea_token: { [key: string]: number };
  token_total: number;
  created_at: string;
  updated_at: string;
}

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  loading: boolean;
  saveLoading: boolean;
  onSelectDraft: (draft: Draft) => void;
  onImportCharacter: () => void;
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
      className="flex justify-end space-x-2 mt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        type="button"
        onClick={onClear}
        className="text-white p-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Clear
      </motion.button>
      <motion.button
        type="button"
        onClick={onSave}
        disabled={saveLoading}
        className="text-white p-3 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faSave} className="mr-2" />
        {saveLoading ? 'Saving...' : 'Save'}
      </motion.button>
      <motion.button
        type="button"
        onClick={handleOpenDraftModal}
        className="text-white p-3 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
        Drafts
      </motion.button>
      <motion.button
        type="button"
        onClick={handleOpenImportCharacterModal}
        className="text-white p-3 rounded-lg bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faUpload} className="mr-2" />
        Import Character
      </motion.button>
      <CreateButton loading={loading} />
      {isDraftModalOpen && (
        <DraftsModal onClose={handleCloseDraftModal} onSelect={onSelectDraft} />
      )}
      {isImportCharacterModalOpen && (
        <ImportCharacterModal onClose={handleCloseImportCharacterModal} onImport={onImportCharacter} />
      )}
    </motion.div>
  );
}
