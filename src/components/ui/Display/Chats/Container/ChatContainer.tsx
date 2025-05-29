import { useEffect, useRef, useState, Suspense } from 'react';
import { useChatStore } from '~/store';
import { ChatMain } from '~/components';
import { Message, ChatContainerProps } from '@shared-types/chatTypes';
import { ChatPageSpinner } from '@components';
import { useChatPageAPI } from '@api';
import clsx from 'clsx';

interface ChatContainerPropsExtended extends ChatContainerProps {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef<{ charId: string | null; userId: string | null }>({
    charId: null,
    userId: null,
  });
  const [charIcon, setCharIcon] = useState<string>(char?.icon ?? '');
  const { messages, setMessages } = useChatStore();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (!char?.icon || charIcon === char.icon) return;
    const img = new Image();
    img.src = char.icon || '';
    img.onload = () => setCharIcon(char.icon || '');
    img.onerror = () => setCharIcon('');
  }, [char?.icon, charIcon]);

  useEffect(() => {
    if (char && firstMessage && messages.length === 0) {
      setMessages([
        {
          character_name: char.character_name ?? 'Unknown',
          text: firstMessage,
          icon: char.icon ?? '',
          type: 'assistant',
        },
        ...previous_message,
      ]);
    }
  }, [char, firstMessage, previous_message, setMessages, messages.length]);

  useEffect(() => {
    const storedBgImage = localStorage.getItem('bgImage');
    if (storedBgImage) {
      setBgImage(storedBgImage);
    } else if (char?.icon) {
      setBgImage(char.icon);
    }
  }, [char?.icon]);

  return (
    <Suspense fallback={<ChatPageSpinner />}>
      <div
        className={clsx(
          'flex justify-center items-center w-full h-full',
          className,
          {
            'bg-cover': bgImage,
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
          char={{ ...char, icon: charIcon }}
          previous_message={messages}
          isGenerating={isGenerating}
          messagesEndRef={messagesEndRef}
          setMessages={setMessages}
          messageIdRef={messageIdRef}
          setIsGenerating={setIsGenerating}
          chat_uuid={chat_uuid}
        />
      </div>
    </Suspense>
  );
}
