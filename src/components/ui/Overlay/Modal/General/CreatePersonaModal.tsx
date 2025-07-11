import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  AddCircleOutline as PlusCircleIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { Textarea, Dropzone } from '@components';
import { PyrenzBlueButton, PyrenzModal, PyrenzModalContent } from '~/theme';
import { usePyrenzAlert } from '~/provider';
import { uploadImage } from '@utils';

interface CreatePersonaModalProps {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  newPersonaName: string;
  setNewPersonaName: (name: string) => void;
  newPersonaDescription: string;
  setNewPersonaDescription: (description: string) => void;
  handleCreatePersona: () => void;
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
  selectedImage,
  setSelectedImage,
  isEditing,
  onDelete,
}: CreatePersonaModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    selectedImage
  );
  const [isCreating, setIsCreating] = useState(false);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    setPreviewImage(selectedImage);
  }, [selectedImage]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      setIsCreating(true);
      const { url, error } = await uploadImage('persona-image', file);
      setIsCreating(false);

      if (error) {
        showAlert(error, 'alert');
      } else if (url) {
        setSelectedImage(url);
        setPreviewImage(url);
      }
    }
  };

  return (
    <PyrenzModal open={isModalOpen} onClose={() => setModalOpen(false)}>
      <PyrenzModalContent>
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
                {isEditing ? (
                  <EditIcon fontSize="small" />
                ) : (
                  <PlusCircleIcon fontSize="small" />
                )}
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
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
