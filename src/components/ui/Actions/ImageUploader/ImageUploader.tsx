import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dropzone, Textarea } from '@components';
import {
  Modal,
  Box,
  Card,
  CardMedia,
  Skeleton,
  CircularProgress,
  Typography,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { usePyrenzAlert } from '~/provider';
import { PyrenzBlueButton } from '~/theme';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  initialImage?: string | null;
}

export function ImageUploader({
  onImageSelect,
  initialImage,
}: ImageUploaderProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    initialImage || null
  );
  const [open, setOpen] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (initialImage) setBannerImagePreview(initialImage);
  }, [initialImage]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setTextareaValue('');
    setImageUrl(null);
    setIsSubmitted(false);
    setBannerImagePreview(null);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImagePreview(imageUrl);
      onImageSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!textareaValue.trim()) {
      showAlert('Prompt cannot be empty', 'Alert');
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);

    const prompt = `${textareaValue}`;
    const model = 'turbo';
    const nologo = 'true';
    const enhance = 'true';

    try {
      const queryParams = `${prompt}&model=${model}&nologo=${nologo}&enhance=${enhance}`;
      const url = `https://image.pollinations.ai/prompt/${queryParams}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Image generation failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setImageUrl(blobUrl);

      const file = new File([blob], 'generated-image.png', {
        type: 'image/png',
      });
      onImageSelect(file);
      setBannerImagePreview(blobUrl);
    } catch (error) {
      console.error('Image generation error:', error);
      showAlert('Error creating image', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full mb-4 max-w-2xl mx-auto flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Dropzone
        onDrop={handleDrop}
        label="Drop a banner image here (ᵕ—ᴗ—)"
        initialImage={bannerImagePreview}
        className="w-full"
      />

      <div className="flex justify-center mt-4">
        <PyrenzBlueButton
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={handleOpen}
        >
          Generate Image
        </PyrenzBlueButton>
      </div>

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
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            placeholder="Enter a description to generate an image for your character ₍⑅ᐢ..ᐢ₎"
          />

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

          <div className="flex justify-end mt-4">
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
          </div>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
          >
            Powered by Pollination AI image generation
          </Typography>
        </Box>
      </Modal>
    </motion.div>
  );
}
