import { useDropzone, Accept } from 'react-dropzone'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import { Box, Typography } from '@mui/material'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { usePyrenzAlert } from '~/provider'

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void
  label?: string
  className?: string
  initialImage?: string | null
}

export function Dropzone({
  onDrop,
  label = 'Drop or click to upload image',
  className,
  initialImage,
}: DropzoneProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(initialImage || null)
  const showAlert = usePyrenzAlert()

  useEffect(() => {
    if (initialImage) setBannerImagePreview(initialImage)
  }, [initialImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          showAlert('Please upload an image file.', 'Alert')
          return
        }
        if (file.size > 1024 * 1024) {
          showAlert('File size exceeds 1 MB. Please choose a smaller file.', 'Alert')
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result as string
          setBannerImagePreview(base64data)
        }
        reader.readAsDataURL(file)
        onDrop(acceptedFiles)
      }
    },
    accept: {
      'image/*': ['.jpeg', '.png', '.gif'],
    } as Accept,
    multiple: false,
  })

  return (
    <Box
      {...getRootProps()}
      className={clsx('w-full cursor-pointer select-none', className)}
      sx={{
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px',
        overflow: 'hidden',
        p: 0,
        position: 'relative',
        backdropFilter: isDragActive ? 'blur(6px)' : 'blur(4px)',
        background: isDragActive
          ? 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.08))'
          : 'linear-gradient(to right, rgba(255,255,255,0.03), rgba(255,255,255,0.05))',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.01)',
          background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
        },
      }}
    >
      <input {...getInputProps()} />
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
          }}
        >
          <InsertPhotoOutlinedIcon sx={{ fontSize: '3rem' }} />
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              opacity: 0.8,
              fontSize: '0.95rem',
              px: 2,
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
