import { v4 as uuidv4 } from 'uuid';
import { Utils } from '~/Utility';
import * as Sentry from '@sentry/react';

interface UploadResult {
  url: string | null;
  error: string | null;
}

export async function uploadImage(
  bucketName: string,
  file: File | Blob
): Promise<UploadResult> {
  try {
    const isImageType = file.type.startsWith('image/') || file instanceof Blob;

    if (!isImageType) {
      return { url: null, error: 'Only image files or blobs are allowed.' };
    }

    const maxSizeInBytes = 1 * 1024 * 1024;
    if ('size' in file && file.size > maxSizeInBytes) {
      return { url: null, error: 'File size must be less than 1MB.' };
    }

    const webpBlob = await convertToWebP(file);
    if (!webpBlob) {
      return { url: null, error: 'Failed to convert image to WebP.' };
    }

    const fileName = `${uuidv4()}.webp`;
    const filePath = fileName;

    const { error: uploadError } = await Utils.db.client.storage
      .from(bucketName)
      .upload(filePath, webpBlob);

    if (uploadError) {
      Sentry.captureException(uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data: urlData } = Utils.db.client.storage
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

const MAX_DIMENSION = 1024;

async function convertToWebP(input: File | Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const objectUrl = URL.createObjectURL(input);
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const aspectRatio = width / height;

            if (aspectRatio > 1) {
              width = MAX_DIMENSION;
              height = Math.round(MAX_DIMENSION / aspectRatio);
            } else {
              height = MAX_DIMENSION;
              width = Math.round(MAX_DIMENSION * aspectRatio);
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            return resolve(null);
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl);
              resolve(blob ?? null);
            },
            'image/webp',
            0.9
          );
        } catch {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };

      img.src = objectUrl;
    } catch {
      resolve(null);
    }
  });
}
