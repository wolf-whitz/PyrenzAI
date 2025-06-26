import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { AddCircleOutline as PlusCircleIcon, EditOutlined as EditIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { Textarea, Dropzone } from '@components';
import { PyrenzBlueButton } from '~/theme';
import { usePyrenzAlert } from '~/provider';
import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface CreatePersonaModalProps {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  newPersonaName: string;
  setNewPersonaName: (name: string) => void;
  newPersonaDescription: string;
  setNewPersonaDescription: (description: string) => void;
  handleCreatePersona: () => void;
  setCharacterCardImageModalOpen: (open: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  isEditing: boolean;
  onDelete?: () => void;
}

export function CreatePersonaModal({
  isModalOpen,
  setModalOpen,
  newPersonaName,
  setNewPersonaName,
  newPersonaDescription,
  setNewPersonaDescription,
  handleCreatePersona,
  setCharacterCardImageModalOpen,
  selectedImage,
  setSelectedImage,
  isEditing,
  onDelete,
}: CreatePersonaModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(selectedImage);
  const [isCreating, setIsCreating] = useState(false);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    setPreviewImage(selectedImage);
  }, [selectedImage]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (file.size > 1024 * 1024) {
        showAlert('File is too large. Maximum size is 1MB.', 'alert');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      const fileName = `persona-image-${uuidv4()}.png`;

      setIsCreating(true);
      const { data, error } = await supabase.storage
        .from('persona-image')
        .upload(fileName, file, {
          contentType: 'image/png',
        });

      if (error) {
        showAlert('Failed to upload image to Supabase Storage.', 'alert');
        console.error('Error uploading image:', error);
      } else {
        const publicUrl = supabase.storage
          .from('persona-image')
          .getPublicUrl(fileName).data.publicUrl;

        setSelectedImage(publicUrl);
        setPreviewImage(publicUrl);
      }
      setIsCreating(false);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="create-persona-modal"
      aria-describedby="create-persona-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isModalOpen}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md text-white shadow-xl rounded-xl p-6 max-h-[90vh] overflow-y-auto"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography
            variant="h6"
            className="text-center text-lg font-semibold mb-6"
          >
            {isEditing ? 'Edit Persona' : 'Create New Persona'}
          </Typography>

          <Dropzone
            onDrop={onDrop}
            className="mb-4"
            initialImage={previewImage}
          />

          <PyrenzBlueButton
            onClick={() => setCharacterCardImageModalOpen(true)}
            className="mb-4 w-full"
          >
            Choose Premade Images
          </PyrenzBlueButton>

          <Textarea
            label="Name"
            value={newPersonaName}
            onChange={(e) => setNewPersonaName(e.target.value)}
            className="mb-4"
            showTokenizer={true}
          />

          <Textarea
            label="Description"
            value={newPersonaDescription}
            onChange={(e) => setNewPersonaDescription(e.target.value)}
            className="mb-6"
            showTokenizer={true}
          />

          <Box className="flex justify-center mt-8 gap-4">
            <PyrenzBlueButton
              onClick={handleCreatePersona}
              disabled={isCreating}
              className="min-w-[120px] flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                <>
                  {isEditing ? <EditIcon fontSize="small" /> : <PlusCircleIcon fontSize="small" />}
                  <span>{isEditing ? 'Update' : 'Create'}</span>
                </>
              )}
            </PyrenzBlueButton>

            {isEditing && onDelete && (
              <PyrenzBlueButton
                onClick={onDelete}
                className="min-w-[120px] flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
              >
                <DeleteIcon fontSize="small" />
                <span>Delete</span>
              </PyrenzBlueButton>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
