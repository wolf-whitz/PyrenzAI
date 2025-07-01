import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '@components';
import { Utils } from '~/Utility/Utility';
import { usePyrenzAlert } from '~/provider';
import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton } from '~/theme';

interface CreateCharacterCardImageModalProps {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export function CreateCharacterCardImageModal({
  isModalOpen,
  setModalOpen,
}: CreateCharacterCardImageModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const showAlert = usePyrenzAlert();

  const onDrop = (acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!name) {
      showAlert('Name is required', 'Alert');
      return;
    }
    if (!description) {
      showAlert('Description is required', 'Alert');
      return;
    }
    if (!image) {
      showAlert('Image is required', 'Alert');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      const data = {
        card_name: name,
        card_description: description,
        card_image: base64Image,
      };

      try {
        const response = await Utils.post<{
          message: string;
          imageUrl: string;
        }>('/api/ProfileCardsUpload', data);

        if (response.message === 'Card uploaded') {
          setModalOpen(false);
          setName('');
          setDescription('');
          setImage(null);

          showAlert('Profile card uploaded successfully', 'Success');
        } else {
          showAlert(
            response.message || 'Failed to upload profile card',
            'Alert'
          );
        }
      } catch (error) {
        console.error('Error uploading profile card:', error);
        showAlert('Error uploading profile card', 'Alert');
      } finally {
        setLoading(false);
      }
    };
  };

  if (!isModalOpen) return null;

  return (
    <PyrenzModal
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
    >
      <PyrenzModalContent>
        <h2 className="mb-4 text-white">
          Create Character Card Image
        </h2>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-white">Drop the image here</p>
          ) : (
            <p className="text-white">
              Drag & drop an image here, or click to select one
            </p>
          )}
          {image && (
            <p className="mt-2 text-white">Selected image: {image.name}</p>
          )}
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
        <PyrenzBlueButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Uploading...' : 'Submit'}
        </PyrenzBlueButton>
        <PyrenzBlueButton
          variant="outlined"
          color="secondary"
          onClick={() => setModalOpen(false)}
          fullWidth
          className="mt-2"
        >
          Cancel
        </PyrenzBlueButton>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
