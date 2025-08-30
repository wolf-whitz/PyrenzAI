import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { PyrenzDropzone } from '~/theme';
import { usePyrenzAlert } from '~/provider';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  label?: string;
  className?: string;
  initialImage?: string | null;
}

export function Dropzone({
  onDrop,
  label = 'Click to upload image',
  className,
  initialImage,
}: DropzoneProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    initialImage || null
  );
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (initialImage) setBannerImagePreview(initialImage);
  }, [initialImage]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('Please upload an image file.', 'Alert');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setBannerImagePreview(base64data);
    };
    reader.readAsDataURL(file);
    onDrop([file]);
  };

  return (
    <PyrenzDropzone className={className}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      {bannerImagePreview ? (
        <Box
          component="img"
          src={bannerImagePreview}
          alt="upload preview"
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            borderRadius: '20px',
          }}
          onClick={() =>
            document
              .querySelector<HTMLInputElement>('input[type=file]')
              ?.click()
          }
        />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 5,
            color: '#aaa',
            gap: 1,
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() =>
            document
              .querySelector<HTMLInputElement>('input[type=file]')
              ?.click()
          }
        >
          {label}
        </Box>
      )}
    </PyrenzDropzone>
  );
}
