import { useState, useEffect } from 'react';
import { Utils } from '~/Utility';
import { usePyrenzAlert } from '~/provider';

interface ImageResponse {
  data: {
    data: Array<{ url: string }>;
  };
}

interface UseImageGenerateProps {
  initialImage?: string | null;
  onImageSelect: (file: File | null) => void;
}

export const useImageGenerate = ({ initialImage, onImageSelect }: UseImageGenerateProps) => {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(initialImage || null);
  const [open, setOpen] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const [modelInstruction, setModelInstruction] = useState('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageType, setImageType] = useState<'anime' | 'realistic'>('anime');
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (initialImage) setBannerImagePreview(initialImage);
  }, [initialImage]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setTextareaValue('');
    setModelInstruction('');
    setAdditionalPrompt('');
    setImageUrl(null);
    setIsSubmitted(false);
    setBannerImagePreview(null);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImagePreview(imageUrl);
      onImageSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!textareaValue.trim()) {
      showAlert('Prompt cannot be empty', 'Alert');
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);

    try {
      const finalPrompt = `
${modelInstruction.trim()}

Scene Description:
${textareaValue.trim()}

Additional Prompt:
${additionalPrompt.trim()}
      `.trim();

      const res = await Utils.post<ImageResponse>('/api/ImageGen', {
        query: finalPrompt,
        type: imageType,
      });

      if (!res?.data?.data || res.data.data.length === 0) {
        throw new Error('No image URL returned');
      }

      const firstImageUrl = res.data.data[0].url;
      setImageUrl(firstImageUrl);
      setBannerImagePreview(firstImageUrl);
      onImageSelect(null); // Reset file selection
    } catch (error) {
      console.error('Image generation error:', error);
      showAlert('Error creating image', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bannerImagePreview,
    open,
    textareaValue,
    modelInstruction,
    additionalPrompt,
    imageUrl,
    isLoading,
    isSubmitted,
    imageType,
    setTextareaValue,
    setModelInstruction,
    setAdditionalPrompt,
    setImageType,
    handleOpen,
    handleClose,
    handleClear,
    handleDrop,
    handleSubmit,
  };
};
