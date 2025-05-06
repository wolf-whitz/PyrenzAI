/**
 * The application's function index file
 * This file serves as a central export point for all the database fetch functions that are used in the application itself.
 */

//Tags
import { GetHotCharacters } from './Character/GetHotCharacters';
import { GetLatestCharacters } from './Character/GetLatestCharacters';
import { GetRandomCharacters } from './Character/GetRandomCharacters';
import { GetCharactersWithTags } from './Character/GetCharactersWithTag';
import { fetchCharacters } from './Character/fetchCharacters';

import CreateNewChat from './Chats/CreateNewchat';
import GetChatData from './Chats/GetChatData';

import { GetUserData } from './persona/GetUserPersona';

import { GetUserUUID } from './General/GetUserUUID';

export {
  GetHotCharacters,
  GetLatestCharacters,
  GetRandomCharacters,
  GetCharactersWithTags,
  CreateNewChat,
  GetChatData,
  fetchCharacters,
  GetUserData,
  GetUserUUID,
};
