import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dropzone, Textarea } from '~/components';
import { Button, Modal, Box, TextField, Skeleton, Card, CardMedia, CircularProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Utils } from "~/Utility/Utility";
import { toast } from 'react-hot-toast';

interface CreateImageResponse {
  image: string;
}

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result as string);
        onImageSelect(file);
        sessionStorage.setItem('Character_Create_Image_Profile', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setTextareaValue('');
    setImageUrl(null);
    setIsSubmitted(false);
    sessionStorage.removeItem('Character_Create_Image_Profile');
  };

  const handleSubmit = async () => {
    if (!textareaValue.trim()) {
      toast.error('Prompt cannot be empty');
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);

    const payload = {
      negative_prompt: inputValue,
      prompt: textareaValue,
    };

    try {
      const response = await Utils.post('/api/CreateImage', payload);
      const typedResponse = response as CreateImageResponse;
      if (typedResponse.image) {
        setImageUrl(typedResponse.image);
        sessionStorage.setItem('Character_Create_Image_Profile', typedResponse.image);
        fetch(typedResponse.image)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "generated-image.png", { type: "image/png" });
            onImageSelect(file);
          });
      }
    } catch (error) {
      toast.error('Error creating image');
      console.error('Error creating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Dropzone
        onDrop={onDrop}
        label="Drop a banner image here&nbsp;&nbsp;&nbsp;(ᵕ—ᴗ—)"
        className="bg-gray-800 border-dashed border-2 border-gray-500"
      />
      <div className="flex items-center mt-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddPhotoAlternateIcon />}
          className="mr-2"
          onClick={handleOpen}
        >
          Generate Image
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <TextField
            fullWidth
            label="negative_prompt"
            placeholder="keywords of what you **do not** wish to see in the output image"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            placeholder="Enter a description to generate an image for your character&nbsp;&nbsp;₍⑅ᐢ..ᐢ₎"
          />
          {isSubmitted && (
            <Card sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              {isLoading ? (
                <CircularProgress />
              ) : imageUrl ? (
                <CardMedia component="img" height="200" image={imageUrl} alt="Generated" />
              ) : (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
            </Card>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outlined" color="secondary" onClick={handleClear} sx={{ mr: 2 }}>
              Clear
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </motion.div>
  );
}
