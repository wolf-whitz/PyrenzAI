import React from 'react';
import ReactDOM from 'react-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Modal,
} from '@mui/material';
import { PlusCircle } from 'lucide-react';
import { Textarea } from '@components/index';
import { useDropzone } from 'react-dropzone';

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
  selectedImage: string;
}

export default function CreatePersonaModal({
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
}: CreatePersonaModalProps) {
  if (!isModalOpen) return null;

  const onDrop = (acceptedFiles: File[]) => {
    setCharacterCardImageModalOpen(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return ReactDOM.createPortal(
    <Modal
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="create-persona-modal"
      aria-describedby="create-persona-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 text-white shadow-xl rounded-xl p-6">
        <Typography
          variant="h6"
          className="text-center text-lg font-semibold mb-6"
        >
          Create New Persona
        </Typography>

        <div
          {...getRootProps()}
          className="mb-4 p-4 border-2 border-dashed border-gray-500 rounded-lg text-center cursor-pointer relative"
        >
          <input {...getInputProps()} />
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
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

        <Button
          variant="contained"
          color="primary"
          onClick={() => setCharacterCardImageModalOpen(true)}
          className="mb-4 w-full bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          Choose Premade Images
        </Button>

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

        <Box className="flex justify-center mt-8">
          <Button
            onClick={handleCreatePersona}
            variant="contained"
            color="primary"
            disabled={creating}
            className="min-w-[120px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            {creating ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Create</span>
              </>
            )}
          </Button>
        </Box>
      </Box>
    </Modal>,
    document.getElementById('modal-root')!
  );
}
