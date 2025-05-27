import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Typography,
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
    Placeholder: 'Link Example: https://www.sakura.fm/chat/4Xa0Rsc?id=3mBbOSH',
  },
  {
    Website: 'Dopple',
    Placeholder:
      'Link Example: https://beta.hiwaifu.com/chat/chattow?destination=newChat&chat_id=4443d97b7e433b321c875839fef1af93&session_id=433476874',
  },
  {
    Website: 'Character AI',
    Placeholder:
      'Link Example: https://character.ai/chat/smtV3Vyez6ODkwS8BErmBAdgGNj-1XWU73wIFVOY1hQ',
  },
  {
    Website: 'FlowGPT',
    Placeholder:
      'Link Example: https://flowgpt.com/chat/investgpt-use-chatgpt-to-invest',
  },
  {
    Website: 'SpicyChat',
    Placeholder:
      'Link Example: https://spicychat.ai/chat/bc0e0b5a-0f72-4f1a-a2f4-5ce50849c6f7',
  },
  {
    Website: 'PepHopAi',
    Placeholder:
      'Link Example: https://pephop.ai/characters/12fe3b95-b73b-434c-88e7-a9276ddcd70a_character-chef-lauren',
  },
  {
    Website: 'ChubAI',
    Placeholder:
      'Link Example: https://chub.ai/characters/dsiqueira/misandristic-society-of-themyscira-23f168c6f709',
  },
  {
    Website: 'PolyAI',
    Placeholder:
      'Link Example: https://www.polybuzz.ai/character/chat/pb2HN?recSid=f6df7cae5f678272:cbda1a8b8be92cbc:164c4bb9f71f236b:1&chatScene=3&genderTab=all',
  },
  {
    Website: 'CharSnap',
    Placeholder:
      'Link Example: https://charsnap.ai/conversation/1af4c8b1-10e1-46a9-8055-2ab3c2d3458e',
  },
  {
    Website: 'SpellBound',
    Placeholder:
      'Link Example: https://www.tryspellbound.com/app/characters/169123',
  },
];

export function ImportCharacterModal({
  onClose,
  onImport,
}: ImportCharacterModalProps) {
  const [link, setLink] = useState('');
  const [selectedAI, setSelectedAI] = useState('Character AI');
  const [placeholder, setPlaceholder] = useState(
    'Link Example: https://character.ai/chat/smtV3Vyez6ODkwS8BErmBAdgGNj-1XWU73wIFVOY1hQ'
  );
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
      setSelectedAI(event.target.value);
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
        { type: selectedAI, url: link }
      );

      if (response.success && response.data.error) {
        showAlert('Error importing character: ' + response.data.error, 'Alert');
        Sentry.captureMessage('Error importing character', {
          extra: {
            error: response.data.error,
          },
        });
      } else {
        const data = response.data;
        if (!data) {
          throw new Error('Invalid response data');
        }

        const extractedData = {
          first_message: data.first_message,
          tags: data.tags ? [{ name: data.tags }] : [],
          persona: data.persona,
          scenario: data.scenario,
          name: data.name,
          description: data.description,
        };

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
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={true}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: 'md',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
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
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImport}
                disabled={loading || !link || !selectedAI}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Import'
                )}
              </Button>
            </div>
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
