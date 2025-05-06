import { fetchCharacters } from './Character/CharacterAPI';
import { fetchChatData } from './Chatpage/ChatPageAPI';
import {
  handleLogin,
  handleOAuthSignIn,
  handleSignUp,
  sendUserDataToSupabase,
  extractTokensFromLocalStorage,
} from './Modals/AuthenticationAPI';
import { useCreateAPI } from './CreatePage/CreateAPI';

export {
  fetchCharacters,
  fetchChatData,
  handleLogin,
  handleOAuthSignIn,
  handleSignUp,
  sendUserDataToSupabase,
  extractTokensFromLocalStorage,
  useCreateAPI,
};
