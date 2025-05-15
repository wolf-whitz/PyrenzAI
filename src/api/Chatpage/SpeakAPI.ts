import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

export const speakMessage = async (message: string, gender: string) => {
  try {
    const url = 'https://text.pollinations.ai/';

    const voiceType = gender === 'female' ? 'nova' : 'onyx';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Narrate what the character is currently saying. Speak as if you are a real, living character experiencing and narrating this moment from your own point of view. Make it feel natural, immersive, and full of personality — like your alive and telling a story about what’s happening. Replace {{user}} with 'you' and always use first person.`,
          },
          {
            role: 'user',
            content: `${message}`,
          },
        ],
        model: 'openai-audio',
        modalities: ['text', 'audio'],
        private: false,
        audio: {
          voice: voiceType,
          format: 'wav',
        },
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API error:', error);
      throw new Error(
        error?.details?.error?.message ||
          `HTTP error! status: ${response.status}`
      );
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error('Error fetching or playing the audio:', error);
    toast.error('Failed to fetch or play the audio.');
    Sentry.captureException(error);
  }
};
