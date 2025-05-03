import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '@components/index';
import { Utils } from '~/Utility/Utility';
import { createPortal } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateCharacterCardImageModalProps {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

// Define the expected response type
interface ApiResponse {
  success: boolean;
  // Add other fields if necessary
}

export default function CreateCharacterCardImageModal({
  isModalOpen,
  setModalOpen,
}: CreateCharacterCardImageModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!name) {
      toast.error('Name is required');
      return;
    }
    if (!description) {
      toast.error('Description is required');
      return;
    }
    if (!file) {
      toast.error('File is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const response = await Utils.post<ApiResponse>('/api/ProfileCardsUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        setModalOpen(false);
        setName('');
        setDescription('');
        setFile(null);
        toast.success('Profile card uploaded successfully');
      } else {
        toast.error('Failed to upload profile card');
      }
    } catch (error) {
      toast.error('Error uploading profile card');
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <Typography variant="h6" className="mb-4 text-white">
          Create Character Card Image
        </Typography>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-white">Drop the file here</p>
          ) : (
            <p className="text-white">Drag & drop an image here, or click to select one</p>
          )}
          {file && <p className="mt-2 text-white">Selected file: {file.name}</p>}
        </div>
        <Textarea
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Uploading...' : 'Submit'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setModalOpen(false)}
          fullWidth
          className="mt-2"
        >
          Cancel
        </Button>
      </Box>
      <ToastContainer />
    </div>,
    document.getElementById('modal-root')!
  );
}
