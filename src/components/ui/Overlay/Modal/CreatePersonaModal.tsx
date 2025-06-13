import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Textarea } from '@components';
import { useDropzone } from 'react-dropzone';
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
  creating: boolean;
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
  creating,
  setCharacterCardImageModalOpen,
  selectedImage,
  setSelectedImage,
  isEditing,
  onDelete,  
}: CreatePersonaModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(selectedImage);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    setPreviewImage(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

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

      const { error } = await supabase.storage
        .from('persona-image')
        .upload(fileName, file, {
          contentType: 'image/png',
        });

      if (error) {
        showAlert('Failed to upload image to Supabase Storage.', 'alert');
        console.error('Error uploading image:', error);
      } else {
        setSelectedImage(previewUrl);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: 1024 * 1024,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            showAlert('File is too large. Maximum size is 1MB.', 'alert');
          }
          if (error.code === 'file-invalid-type') {
            showAlert('Invalid file type. Only JPEG, JPG, and PNG images are allowed.', 'alert');
          }
        });
      });
    },
  });

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
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md text-white shadow-xl rounded-xl p-6 bg-gray-800 max-h-[90vh] overflow-y-auto">
          <Typography
            variant="h6"
            className="text-center text-lg font-semibold mb-6"
          >
            {isEditing ? 'Edit Persona' : 'Create New Persona'}
          </Typography>

          <div
            {...getRootProps()}
            className="mb-4 p-4 border-2 border-dashed border-gray-500 rounded-lg text-center cursor-pointer relative"
          >
            <input {...getInputProps()} />
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-60 object-cover rounded-lg"
              />
            ) : (
              <>
                {isDragActive ? (
                  <p>Drop the files here</p>
                ) : (
                  <p>Drag & drop an image here, or click to select an image</p>
                )}
              </>
            )}
          </div>

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
              disabled={creating}
              className="min-w-[120px] flex items-center justify-center gap-2"
            >
              {creating ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                <>
                  {isEditing ? <Edit size={18} /> : <PlusCircle size={18} />}
                  <span>{isEditing ? 'Update' : 'Create'}</span>
                </>
              )}
            </PyrenzBlueButton>

            {isEditing && onDelete && (
              <PyrenzBlueButton
                onClick={onDelete}
                className="min-w-[120px] flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </PyrenzBlueButton>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
