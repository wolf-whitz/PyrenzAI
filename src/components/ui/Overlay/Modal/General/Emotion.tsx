import { TextField, IconButton, Typography, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ImageUploader } from '@components';
import {
  PyrenzBlueButton,
  PyrenzModal,
  PyrenzModalContent,
  PyrenzCard,
} from '~/theme';
import { uploadImage } from '~/Utility/UploadImage';
import { useState, useEffect } from 'react';
import { useCharacterStore } from '~/store';
import { z } from 'zod';
import { EmotionSchema } from '@shared-types';

interface EmotionProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    result: z.infer<typeof EmotionSchema> & { file: File | null }
  ) => void;
}

export function Emotion({ open, onClose, onSave }: EmotionProps) {
  const [triggerInput, setTriggerInput] = useState('');
  const [allTriggers, setAllTriggers] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const addEmotion = useCharacterStore((s) => s.addEmotion);
  const emotions = useCharacterStore((s) => s.emotions);

  useEffect(() => {
    const triggers = triggerInput
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    setAllTriggers(triggers);
  }, [triggerInput]);

  useEffect(() => {
    if (open) return;
    setTriggerInput('');
    setImageUrl(null);
    setImageFile(null);
    setUploadError(null);
  }, [open]);

  async function handleImageSelect(file: File | null) {
    if (!file) {
      setImageUrl(null);
      setImageFile(null);
      setUploadError(null);
      return;
    }

    setUploading(true);
    setUploadError(null);

    const { url, error } = await uploadImage('character-image', file);

    setImageUrl(url);
    setImageFile(file);
    setUploadError(error);
    setUploading(false);
  }

  function handleSave() {
    const triggerWords = triggerInput
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);

    const payload = {
      triggerWords,
      imageUrl,
      file: imageFile,
    } satisfies z.infer<typeof EmotionSchema> & { file: File | null };

    addEmotion({
      triggerWords,
      imageUrl,
      file: imageFile,
    });

    onSave(payload);
    onClose();
  }

  return (
    <PyrenzModal open={open} onClose={onClose}>
      <PyrenzModalContent>
        <PyrenzCard sx={{ mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              sx={{ color: '#fff', fontWeight: 600, fontSize: '1.25rem' }}
            >
              Create New Emotion
            </Typography>
            <IconButton onClick={onClose} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <ImageUploader onImageSelect={handleImageSelect} />
            {uploading && (
              <Typography color="primary">Uploading image...</Typography>
            )}
            {uploadError && (
              <Typography color="error">{uploadError}</Typography>
            )}

            <TextField
              label="Trigger Words (comma-separated)"
              value={triggerInput}
              onChange={(e) => setTriggerInput(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                sx: {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
              }}
            />

            {allTriggers.length > 0 && (
              <PyrenzCard>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Current Triggers:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {allTriggers.map((trigger, i) => (
                    <Typography
                      key={i}
                      sx={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 14,
                      }}
                    >
                      {trigger}
                    </Typography>
                  ))}
                </Stack>
              </PyrenzCard>
            )}

            {emotions.length > 0 && (
              <PyrenzCard>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Saved Emotions:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={2}>
                  {emotions.map((e, i) => (
                    <PyrenzCard key={i} sx={{ p: 2, width: 120 }}>
                      {e.imageUrl && (
                        <img
                          src={e.imageUrl}
                          alt="emotion"
                          style={{
                            width: '100%',
                            borderRadius: 8,
                            marginBottom: 8,
                          }}
                        />
                      )}
                      <Stack spacing={0.5}>
                        {e.triggerWords.map((word, idx) => (
                          <Typography
                            key={idx}
                            variant="caption"
                            color="textSecondary"
                          >
                            {word}
                          </Typography>
                        ))}
                      </Stack>
                    </PyrenzCard>
                  ))}
                </Stack>
              </PyrenzCard>
            )}

            <Stack direction="row" justifyContent="flex-end" gap={2}>
              <PyrenzBlueButton onClick={onClose} variant="outlined">
                Cancel
              </PyrenzBlueButton>
              <PyrenzBlueButton
                variant="contained"
                onClick={handleSave}
                disabled={!imageUrl || uploading}
              >
                Save Emotion
              </PyrenzBlueButton>
            </Stack>
          </Stack>
        </PyrenzCard>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
