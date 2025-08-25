import { useState, useEffect } from 'react';
import { Utils } from '~/utility';
import { usePyrenzAlert } from '~/provider';

interface ShuttleImage {
  url: string;
}

type ShuttleImageResponse = ShuttleImage[];

interface UseImageGenerateProps {
  initialImage?: string | null;
  onImageSelect: (file: File | null) => void;
}

const DEFAULT_MODEL_INSTRUCTION = `Create a highly vivid and visually rich scene. Describe the characters in third-person perspective using no names — refer to them only as "a man", "a woman", or their appropriate gender identity.
Capture every detail: their pose, their expressions, their clothing, and emotional state.
Paint the entire background with specific detail — lighting, atmosphere, weather, time of day, and any dynamic action happening.
Ensure everything is cinematic and immersive.`;

const DEFAULT_ADDITIONAL_PROMPT = `complex background, Detailed Room, Detiled character, ((Cinematic pose)), ((cinematic up Shot)), cinematic lighting, masterpiece, ultra-detailed, best quality ,intricate details ,ai-generated, perfect anatomy, absurdres`;

export const useImageGenerate = ({
  initialImage,
  onImageSelect,
}: UseImageGenerateProps) => {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    initialImage || null
  );
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
    setBannerImagePreview(initialImage || null);
  }, [initialImage]);

  useEffect(() => {
    if (!modelInstruction) setModelInstruction(DEFAULT_MODEL_INSTRUCTION);
    if (!additionalPrompt) setAdditionalPrompt(DEFAULT_ADDITIONAL_PROMPT);
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setTextareaValue('');
    setModelInstruction(DEFAULT_MODEL_INSTRUCTION);
    setAdditionalPrompt(DEFAULT_ADDITIONAL_PROMPT);
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
      const blocks: string[] = [];

      if (modelInstruction.trim())
        blocks.push(`Model Instruction:\n${modelInstruction.trim()}`);
      blocks.push(`Scene Description:\n${textareaValue.trim()}`);
      if (additionalPrompt.trim())
        blocks.push(`Additional Prompt:\n${additionalPrompt.trim()}`);

      const finalPrompt = blocks.join('\n\n');

      const res = await Utils.post<ShuttleImageResponse>('/api/ImageGen', {
        query: finalPrompt,
        type: imageType,
      });

      if (!res || !Array.isArray(res) || res.length === 0) {
        throw new Error('No image returned');
      }

      const firstImageUrl = res[0].url;
      setImageUrl(firstImageUrl);
      setBannerImagePreview(firstImageUrl);

      const blob = await fetch(firstImageUrl).then((r) => r.blob());
      const file = new File([blob], 'generated-image.png', { type: blob.type });
      onImageSelect(file);
    } catch (err) {
      console.error('Image generation error:', err);
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
