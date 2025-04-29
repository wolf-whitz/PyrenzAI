import { fetchCharacters } from './Character/CharacterAPI';
import { fetchChatData } from './Chatpage/ChatPageAPI';
import { handleLogin, handleOAuthSignIn,  handleSignUp, sendUserDataToSupabase, extractTokensFromLocalStorage } from './Modals/AuthenticationAPI';

export {
  fetchCharacters,
  fetchChatData,
  handleLogin,
  handleOAuthSignIn,
  handleSignUp,
  sendUserDataToSupabase,
  extractTokensFromLocalStorage,
};
