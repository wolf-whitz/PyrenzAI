import { Utils } from '@utils';

interface EncryptionResponse {
  success: boolean;
  encryptedText: string;
}

export const encrypt = async (plainText: string): Promise<string> => {
  try {
    const response = await Utils.post('/api/Encrypt', { text: plainText }) as EncryptionResponse;

    if (!response.success) {
      throw new Error('Encryption was not successful');
    }

    return response.encryptedText;
  } catch (error) {
    console.error('Encryption API call failed:', error);
    throw error;
  }
};