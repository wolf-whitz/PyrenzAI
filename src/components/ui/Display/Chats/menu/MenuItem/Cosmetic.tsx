import React, { useEffect, useState, useRef } from 'react';
import { saveImageToDB, getImageFromDB, openDB } from '~/Utility/IndexDB';
import { Box, Typography } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';
import { useUserStore } from '~/store';
import { MessageCustomizationModal } from '@components'; 

export function Cosmetic() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setImageURL } = useUserStore();

  useEffect(() => {
    const loadImage = async () => {
      const blob = await getImageFromDB();
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setBgImage(imageUrl);
        setImageURL(imageUrl);
      }
    };
    loadImage();
  }, [setImageURL]);

  const handleSave = async () => {
    if (bgImage) {
      const response = await fetch(bgImage);
      const blob = await response.blob();
      await saveImageToDB(blob);
      setImageURL(bgImage);
    } else {
      const db = await openDB();
      const transaction = db.transaction('images', 'readwrite');
      const store = transaction.objectStore('images');
      store.delete('bgImage');
      setImageURL(null);
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setBgImage(imageUrl);
      setImageURL(imageUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setBgImage(imageUrl);
      setImageURL(imageUrl);
    }
  };

  const handleDeleteImage = async () => {
    setBgImage(null);
    const db = await openDB();
    const transaction = db.transaction('images', 'readwrite');
    const store = transaction.objectStore('images');
    store.delete('bgImage');
    setImageURL(null);
  };

  return (
    <Box sx={{ mt: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Customization
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Change Background
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: dragging ? 'primary.main' : 'grey.500',
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: dragging ? 'grey.600' : 'transparent',
            position: 'relative',
            overflow: 'hidden',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {bgImage ? (
            <img
              src={bgImage}
              alt="Background Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Click or Drag & Drop an image here
            </Typography>
          )}
        </Box>
        <PyrenzBlueButton
          onClick={handleDeleteImage}
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
        >
          Remove Image
        </PyrenzBlueButton>
      </Box>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <PyrenzBlueButton
        onClick={() => setIsModalOpen(true)}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Message Customization
      </PyrenzBlueButton>
      <PyrenzBlueButton
        onClick={handleSave}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Save Changes
      </PyrenzBlueButton>
      <MessageCustomizationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
