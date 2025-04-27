import { useState } from 'react';
import { CreateButton, DraftsModal } from '~/components';

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
}

export default function FormActions({
  onClear,
  onSave,
  loading,
  saveLoading,
  onSelectDraft
}: FormActionsProps) {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const handleOpenDraftModal = () => {
    setIsDraftModalOpen(true);
  };

  const handleCloseDraftModal = () => {
    setIsDraftModalOpen(false);
  };

  return (
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={onClear}
        className="text-white p-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Clear
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saveLoading}
        className="text-white p-3 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {saveLoading ? 'Saving...' : 'Save'}
      </button>
      <button
        type="button"
        onClick={handleOpenDraftModal}
        className="text-white p-3 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Drafts
      </button>
      <CreateButton loading={loading} />
      {isDraftModalOpen && (
        <DraftsModal onClose={handleCloseDraftModal} onSelect={onSelectDraft} />
      )}
    </div>
  );
}
