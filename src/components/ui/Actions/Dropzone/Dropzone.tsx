import { useDropzone, Accept } from 'react-dropzone';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { usePyrenzAlert } from '~/provider';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  label?: string;
  className?: string;
  initialImage?: string | null;
}

export function Dropzone({
  onDrop,
  label = 'Drag & drop an image or click to upload',
  className,
  initialImage,
}: DropzoneProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(initialImage || null);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (initialImage) {
      setBannerImagePreview(initialImage);
    }
  }, [initialImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
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
        onDrop(acceptedFiles);
      }
    },
    accept: {
      'image/*': ['.jpeg', '.png'],
    } as Accept,
    multiple: false,
  });

  return (
    <Box {...getRootProps()} className={clsx('w-full cursor-pointer transition-all duration-200', className)}>
      <input {...getInputProps()} />
      {bannerImagePreview ? (
        <img
          src={bannerImagePreview}
          alt={label}
          className="w-full h-auto object-cover"
        />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            border: '2px dashed grey',
            borderRadius: '16px',
            p: 4,
            bgcolor: isDragActive ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <PersonIcon sx={{ fontSize: '3rem', color: '#ccc' }} />
          <Typography variant="body2" sx={{ color: '#ccc', mt: 1, textAlign: 'center' }}>
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
