import { Utils as utils } from '~/Utility';
import { v4 as uuidv4 } from 'uuid';
import { Character } from '@shared-types';

interface CreateChatResponse {
  error?: string;
  chat_uuid?: string;
}

export async function CreateNewChat(
  characterUuid: string,
  userUUID: string
): Promise<CreateChatResponse> {
  const chatUuid = uuidv4();

  try {
    let character: Character | undefined;

    const { data: publicCharacter } = await utils.db.select<Character>({
      tables: 'public_characters',
      columns: '*',
      match: { char_uuid: characterUuid },
    });

    if (publicCharacter && publicCharacter.length > 0) {
      character = publicCharacter[0];
    } else {
      const { data: privateCharacter } = await utils.db.select<Character>({
        tables: 'private_characters',
        columns: '*',
        match: { char_uuid: characterUuid },
      });

      if (!privateCharacter || privateCharacter.length === 0) {
        throw new Error('Character not found');
      }

      character = privateCharacter[0];
    }

    const {
      model_instructions,
      name,
      persona,
      description,
      profile_image,
      lorebook,
      scenario,
      title,
      attribute,
    } = character;

    await utils.db.insert({
      tables: 'chats',
      data: {
        chat_uuid: chatUuid,
        char_uuid: characterUuid,
        user_uuid: userUUID,
        preview_image: profile_image,
        preview_message: description,
        model_instructions,
        name,
        lorebook,
        persona,
        scenario,
        is_temporary: true,
        attribute,
        title,
      },
    });

    return { chat_uuid: chatUuid };
  } catch (error: any) {
    console.error('Error creating new chat:', error);
    return { error: error.message || 'An unexpected error occurred' };
  }
}
