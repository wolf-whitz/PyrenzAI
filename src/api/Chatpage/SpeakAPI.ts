export const speakMessage = async (message: string) => {
  try {
    const url = 'https://text.pollinations.ai/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Narrate what I am currently saying: ${message}. Speak as if you are a real, living character experiencing and narrating this moment from your own point of view. Make it feel natural, immersive, and full of personality — like you’re alive and telling a story about what’s happening.`,
          },
        ],
        model: 'openai-audio',
        voice: 'nova',
        private: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
  }
};
