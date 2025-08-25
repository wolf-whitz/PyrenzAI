import { Utils } from '~/utility';

interface EncryptionResponse {
  success: boolean;
  encrypted: string;
}

export const encrypt = async (plainText: string): Promise<string> => {
  try {
    const response = (await Utils.post('/api/Encrypt', {
      text: plainText,
    })) as EncryptionResponse;

    if (!response.success) {
      throw new Error('Encryption was not successful');
    }

    return response.encrypted;
  } catch (error) {
    console.error('Encryption API call failed:', error);
    throw error;
  }
};
