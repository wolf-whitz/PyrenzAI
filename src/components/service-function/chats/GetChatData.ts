import { Utils as utils } from '~/Utility';
import { Character } from '@shared-types';

type ChatDataResult = Character | { error: string };

export async function getChatData(chatId: string): Promise<ChatDataResult> {
  try {
    const { data: chatData } = await utils.db.select<{ char_uuid: string }>({
      tables: 'chats',
      columns: '*',
      match: { chat_uuid: chatId },
    });

    if (!chatData || chatData.length === 0) {
      return { error: 'Chat not found' };
    }

    const inputCharUuid = chatData[0].char_uuid;

    const { data: publicCharacterData } = await utils.db.select<Character>({
      tables: 'public_characters',
      columns: '*',
      match: { char_uuid: inputCharUuid },
    });

    if (publicCharacterData && publicCharacterData.length > 0) {
      return publicCharacterData[0];
    }

    const { data: privateCharacterData } = await utils.db.select<Character>({
      tables: 'private_characters',
      columns: '*',
      match: { char_uuid: inputCharUuid },
    });

    if (privateCharacterData && privateCharacterData.length > 0) {
      return privateCharacterData[0];
    }

    return { error: 'Character not found' };
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return { error: 'Unexpected error while fetching chat data' };
  }
}
