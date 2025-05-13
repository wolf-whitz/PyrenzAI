import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dropzone, Textarea } from '~/components';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="w-full mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Dropzone
        onDrop={onDrop}
        label="Drop a banner image here&nbsp;&nbsp;&nbsp;(ᵕ—ᴗ—)"
        className="bg-gray-800 border-dashed border-2 border-gray-500"
      />
    </motion.div>
  );
}
