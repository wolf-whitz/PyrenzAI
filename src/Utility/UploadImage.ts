import { supabase } from '~/Utility';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';

interface UploadResult {
  url: string | null;
  error: string | null;
}

export async function uploadImage(
  bucketName: string,
  file: File
): Promise<UploadResult> {
  try {
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Only image files are allowed.' };
    }

    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return { url: null, error: 'File size must be less than 1MB.' };
    }

    const webpBlob = await convertToWebP(file);
    if (!webpBlob) {
      return { url: null, error: 'Failed to convert image to WebP.' };
    }

    const fileName = `${uuidv4()}.webp`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, webpBlob);

    if (uploadError) {
      Sentry.captureException(uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { url: null, error: 'Failed to retrieve public URL.' };
    }

    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    Sentry.captureException(error);
    return { url: null, error: error.message || 'Unexpected error occurred.' };
  }
}

async function convertToWebP(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else resolve(null);
        },
        'image/webp',
        0.9
      );
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}
