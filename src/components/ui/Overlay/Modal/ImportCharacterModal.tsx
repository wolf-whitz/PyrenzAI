import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SelectChangeEvent,
  CircularProgress,
  Box,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { Textarea, AISelectDropdown } from '~/components';
import { Utils } from '~/Utility/Utility';
import * as Sentry from '@sentry/react';
import { usePyrenzAlert } from '~/provider';
import { PyrenzBlueButton } from '~/theme';

interface ImportCharacterModalProps {
  onClose: () => void;
  onImport: (data: any) => void;
}

interface ImportCharacterResponse {
  success: boolean;
  data: {
    first_message?: string;
    persona?: string;
    scenario?: string;
    name?: string;
    description?: string;
    tags?: string;
    error?: string;
  };
}

interface AIOption {
  Website: string;
  Placeholder: string;
}

const aiOptions: AIOption[] = [
  {
    Website: 'SakuraFm',
    Placeholder: 'Link Example: https://www.sakura.fm/chat/...',
  },
  {
    Website: 'Dopple',
    Placeholder: 'Link Example: https://beta.hiwaifu.com/chat/...',
  },
  {
    Website: 'Character AI',
    Placeholder: 'Link Example: https://character.ai/chat/...',
  },
  {
    Website: 'FlowGPT',
    Placeholder: 'Link Example: https://flowgpt.com/chat/...',
  },
  {
    Website: 'SpicyChat',
    Placeholder: 'Link Example: https://spicychat.ai/chat/...',
  },
  {
    Website: 'PepHopAi',
    Placeholder: 'Link Example: https://pephop.ai/characters/...',
  },
  {
    Website: 'ChubAI',
    Placeholder: 'Link Example: https://chub.ai/characters/...',
  },
  {
    Website: 'PolyAI',
    Placeholder: 'Link Example: https://www.polybuzz.ai/character/chat/...',
  },
  {
    Website: 'CharSnap',
    Placeholder: 'Link Example: https://charsnap.ai/conversation/...',
  },
  {
    Website: 'SpellBound',
    Placeholder:
      'Link Example: https://www.tryspellbound.com/app/characters/...',
  },
];

export function ImportCharacterModal({
  onClose,
  onImport,
}: ImportCharacterModalProps) {
  const [link, setLink] = useState('');
  const [selectedAI, setSelectedAI] = useState(aiOptions[2].Website);
  const [placeholder, setPlaceholder] = useState(aiOptions[2].Placeholder);
  const [loading, setLoading] = useState(false);
  const showAlert = usePyrenzAlert();

  const handleLinkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLink(event.target.value);
  };

  const handleAISelectionChange = (event: SelectChangeEvent<string>) => {
    const selectedOption = aiOptions.find(
      (option) => option.Website === event.target.value
    );
    if (selectedOption) {
      setSelectedAI(selectedOption.Website);
      setPlaceholder(selectedOption.Placeholder);
    }
  };

  const handleImport = async () => {
    if (!link || !selectedAI) {
      showAlert('Please complete all required fields.', 'Alert');
      return;
    }

    setLoading(true);
    try {
      const response = await Utils.post<ImportCharacterResponse>(
        '/api/CharacterExtract',
        {
          type: selectedAI,
          url: link,
        }
      );

      if (response.success && response.data.error) {
        showAlert('Error importing character: ' + response.data.error, 'Alert');
        Sentry.captureMessage('Error importing character', {
          extra: { error: response.data.error },
        });
      } else {
        const data = response.data;
        if (!data) throw new Error('Invalid response data');

        const extractedData = Object.fromEntries(
          Object.entries({
            first_message: data.first_message,
            persona: data.persona,
            scenario: data.scenario,
            name: data.name,
            description: data.description,
            tags: data.tags,
          }).filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ''
          )
        );

        onImport(extractedData);
        showAlert('Character imported successfully!', 'Success');
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showAlert('Error importing character: ' + errorMessage, 'Alert');
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="import-character-modal-title"
      aria-describedby="import-character-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={true}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: 600,
            p: 4,
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            color: 'white',
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="mt-4">
              <AISelectDropdown
                options={aiOptions}
                selectedAI={selectedAI}
                placeholder={placeholder}
                onAISelectionChange={handleAISelectionChange}
              />
              <Textarea
                label="Import a character using link"
                value={link}
                onChange={handleLinkChange}
                className="mt-2 w-full"
                placeholder={placeholder || 'Enter link here'}
                maxLength={100}
                require_link={true}
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <PyrenzBlueButton onClick={onClose}>Cancel</PyrenzBlueButton>
              <PyrenzBlueButton
                variant="contained"
                onClick={handleImport}
                disabled={loading || !link || !selectedAI}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Import'
                )}
              </PyrenzBlueButton>
            </div>
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
