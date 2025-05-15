export const speakMessage = async (message: string) => {
  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(message)}?model=openai-audio&voice=nova`;
    const response = await fetch(url);

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
