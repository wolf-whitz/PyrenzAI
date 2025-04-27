import { fetchCharacters } from './Character/CharacterAPI';
import { fetchChatData } from './Chatpage/ChatPageAPI';
import { handleLogin, handleOAuthSignIn } from './Modals/LoginAPI';
import {
  extractTokensFromLocalStorage,
  handleSignUp,
  handleRegisterOAuthSignIn,
  sendUserDataToSupabase,
} from './Modals/RegisterAPI';

export {
  fetchCharacters,
  fetchChatData,
  handleLogin,
  handleOAuthSignIn,
  handleRegisterOAuthSignIn,
  sendUserDataToSupabase,
  handleSignUp,
  extractTokensFromLocalStorage,
};
