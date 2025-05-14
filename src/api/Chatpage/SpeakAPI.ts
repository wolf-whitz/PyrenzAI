import { useUserStore } from '~/store';

export const speakMessage = (message: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Web Speech API is not supported in this browser.');
  }
};
