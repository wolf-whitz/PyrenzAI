import { useEffect, useRef, useState, Suspense } from 'react';
import { useChatStore } from '~/store';
import { ChatMain } from '~/components';
import { Message, ChatContainerProps, Character } from '@shared-types';
import { ChatPageSpinner } from '@components';
import clsx from 'clsx';

interface ChatContainerPropsExtended extends Omit<ChatContainerProps, 'char'> {
  char?: Partial<Character>;
  previous_message?: Message[];
  className?: string;
  chat_uuid: string;
}

export function ChatContainer({
  user,
  char,
  firstMessage,
  previous_message = [],
  className = '',
  chat_uuid,
}: ChatContainerPropsExtended) {
  const messageIdRef = useRef<{ charId: string | null; userId: string | null }>({
    charId: null,
    userId: null,
  });

  const { messages, setMessages } = useChatStore();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (char && firstMessage && messages.length === 0) {
      setMessages([
        {
          name: char.name || 'Anon',
          text: firstMessage,
          profile_image: char.profile_image || '',
          type: 'assistant',
        },
        ...previous_message,
      ]);
    }
  }, [char, firstMessage, previous_message, setMessages, messages.length, char?.profile_image]);

  useEffect(() => {
    const storedBgImage = localStorage.getItem('bgImage');
    if (storedBgImage) {
      setBgImage(storedBgImage);
    } else if (char?.profile_image) {
      setBgImage(char.profile_image);
    }
  }, [char?.profile_image]);

  return (
    <Suspense fallback={<ChatPageSpinner />}>
      <div
        className={clsx(
          'flex justify-center items-center w-full h-full',
          className,
          {
            'bg-cover': !!bgImage,
          }
        )}
        style={{
          backgroundImage: bgImage
            ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${bgImage})`
            : 'none',
          backgroundPosition: bgImage ? 'center calc(20%)' : 'center',
        }}
      >
        <ChatMain
          user={user}
          char={char as Character}
          previous_message={messages}
          isGenerating={isGenerating}
          setMessages={setMessages}
          messageIdRef={messageIdRef}
          setIsGenerating={setIsGenerating}
          chat_uuid={chat_uuid}
        />
      </div>
    </Suspense>
  );
}
