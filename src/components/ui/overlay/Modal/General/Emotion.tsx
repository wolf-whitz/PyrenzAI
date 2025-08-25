import {
  TextField,
  IconButton,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ImageUploader } from '@components';
import {
  PyrenzBlueButton,
  PyrenzModal,
  PyrenzModalContent,
  PyrenzCard,
} from '~/theme';
import { uploadImage } from '~/utility';
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

const EMOTION_TYPES = [
  'joy',
  'fear',
  'love',
  'anger',
  'grief',
  'pride',
  'caring',
  'desire',
  'relief',
  'disgust',
  'neutral',
  'remorse',
  'sadness',
  'approval',
  'optimism',
  'surprise',
  'amusement',
  'annoyance',
  'confusion',
  'curiosity',
  'gratitude',
  'admiration',
  'excitement',
  'disapproval',
  'nervousness',
  'realization',
  'embarrassment',
  'disappointment',
];

export function Emotion({ open, onClose, onSave }: EmotionProps) {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const emotions = useCharacterStore((state) => state.emotions) ?? [];

  useEffect(() => {
    if (!open) {
      setSelectedEmotion('');
      setImageUrl(null);
      setImageFile(null);
      setUploadError(null);
    }
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
    const payload = {
      triggerWords: [selectedEmotion],
      imageUrl,
      file: imageFile,
    } satisfies z.infer<typeof EmotionSchema> & { file: File | null };

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
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#ccc' }}>Emotion Type</InputLabel>
              <Select
                value={selectedEmotion}
                label="Emotion Type"
                onChange={(e) => setSelectedEmotion(e.target.value)}
                sx={{
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8b5cf6',
                  },
                }}
              >
                {EMOTION_TYPES.map((emotion) => (
                  <MenuItem key={emotion} value={emotion}>
                    {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ImageUploader onImageSelect={handleImageSelect} />
            {uploading && (
              <Typography color="primary">Uploading image...</Typography>
            )}
            {uploadError && (
              <Typography color="error">{uploadError}</Typography>
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
                disabled={!imageUrl || uploading || !selectedEmotion}
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
