import { Dropzone, Textarea, useImageGenerate } from '@components';
import {
  Modal,
  Box,
  Card,
  CardMedia,
  Skeleton,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { PyrenzBlueButton } from '~/theme';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  initialImage?: string | null;
}

export function ImageUploader({
  onImageSelect,
  initialImage,
}: ImageUploaderProps) {
  const {
    bannerImagePreview,
    open,
    textareaValue,
    modelInstruction,
    additionalPrompt,
    imageUrl,
    isLoading,
    isSubmitted,
    imageType,
    setTextareaValue,
    setModelInstruction,
    setAdditionalPrompt,
    setImageType,
    handleOpen,
    handleClose,
    handleClear,
    handleDrop,
    handleSubmit,
  } = useImageGenerate({ initialImage, onImageSelect });

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Dropzone
        onDrop={handleDrop}
        label="Drop a banner image here (ᵕ—ᴗ—)"
        initialImage={bannerImagePreview}
        className="w-full mb-4"
      />

      <PyrenzBlueButton
        variant="contained"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Generate Image
      </PyrenzBlueButton>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            maxHeight: '90vh',
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <Typography fontWeight={600} mb={1}>
            Model Instruction
          </Typography>
          <Textarea
            value={modelInstruction}
            onChange={(e) => setModelInstruction(e.target.value)}
            placeholder="Describe the model's behavior"
          />

          <Typography fontWeight={600} mt={2} mb={1}>
            Scene Description
          </Typography>
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            placeholder="Enter a scene to generate your character ₍⑅ᐢ..ᐢ₎"
          />

          <Typography fontWeight={600} mt={2} mb={1}>
            Additional Prompt
          </Typography>
          <Textarea
            value={additionalPrompt}
            onChange={(e) => setAdditionalPrompt(e.target.value)}
            placeholder="Extra visual or quality instructions"
          />

          <Select
            value={imageType}
            onChange={(e) =>
              setImageType(e.target.value as 'anime' | 'realistic')
            }
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="anime">Anime</MenuItem>
            <MenuItem value="realistic">Realistic</MenuItem>
          </Select>

          {isSubmitted && (
            <Card
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
                maxHeight: 200,
                overflow: 'hidden',
              }}
            >
              {isLoading ? (
                <CircularProgress />
              ) : imageUrl ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={imageUrl}
                  alt="Generated"
                  sx={{ objectFit: 'contain' }}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
            </Card>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <PyrenzBlueButton
              variant="contained"
              onClick={handleClear}
              sx={{ mr: 2 }}
            >
              Clear
            </PyrenzBlueButton>
            <PyrenzBlueButton variant="contained" onClick={handleSubmit}>
              Submit
            </PyrenzBlueButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
