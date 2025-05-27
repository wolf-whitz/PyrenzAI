import { useDropzone, Accept } from 'react-dropzone';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { usePyrenzAlert } from '~/provider';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  label?: string;
  className: string;
  initialImage?: string | null;
}

export function Dropzone({
  onDrop,
  label = 'Drag & drop a file here or click to upload',
  className,
  initialImage,
}: DropzoneProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(initialImage || null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (initialImage) {
      setBannerImagePreview(initialImage);
    }
  }, [initialImage]);

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        const isDuplicate = uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name && uploadedFile.size === file.size);

        if (isDuplicate) {
          showAlert('This file has already been uploaded.', 'Alert');
          return;
        }

        if (!file.type.startsWith('image/')) {
          showAlert('Please upload an image file.', 'Alert');
          return;
        }

        if (file.size > 1024 * 1024) {
          showAlert('File size exceeds 1 MB. Please choose a smaller file.', 'Alert');
          return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result as string;
          setBannerImagePreview(base64data);
        };

        reader.readAsDataURL(file);

        setUploadedFiles((prevFiles) => [...prevFiles, file]);
      }
      onDrop(acceptedFiles);
    },
    accept: {
      'image/*': ['.jpeg', '.png'],
    } as Accept,
    multiple: false,
  });

  return (
    <Box className="relative">
      <Box
        {...getBannerRootProps()}
        className={clsx(
          'relative flex flex-col items-center justify-center cursor-pointer transition-colors',
          isBannerDragActive ? 'bg-gray-700' : 'bg-gray-800',
          'border-dashed border-2 border-gray-500',
          className,
          'rounded-lg'
        )}
        sx={{
          height: '490px',
          width: '300px',
        }}
      >
        <input {...getBannerInputProps()} />
        {bannerImagePreview ? (
          <img
            src={bannerImagePreview}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <>
            <PersonIcon sx={{ fontSize: '2rem', color: 'white' }} />
            <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
              {label}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
