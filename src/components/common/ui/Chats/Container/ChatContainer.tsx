import { useEffect, useRef, useState, Suspense } from 'react';
import { useChatStore } from '~/store';
import { ChatMain } from '~/components';
import {
  Message,
  ChatContainerProps,
} from '@shared-types/chatTypes';
import { ChatPageSpinner } from '@ui/Spinner/Spinner';

interface ChatContainerPropsExtended extends ChatContainerProps {
  previous_message?: Message[];
  className?: string;
  conversation_id: string;
}

export default function ChatContainer({
  user,
  char,
  firstMessage,
  previous_message = [],
  className = '',
  conversation_id,
}: ChatContainerPropsExtended) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef<{ charId: string | null; userId: string | null }>({ charId: null, userId: null });
  const [charIcon, setCharIcon] = useState<string>(char?.icon ?? '');
  const { messages, setMessages } = useChatStore();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!char?.icon || charIcon === char.icon) return;
    const img = new Image();
    img.src = char.icon;
    img.onload = () => setCharIcon(char.icon || '');
    img.onerror = () => setCharIcon('');
  }, [char?.icon, charIcon]);

  useEffect(() => {
    if (char && firstMessage && messages.length === 0) {
      setMessages([
        {
          name: char.name ?? 'Unknown',
          text: firstMessage,
          icon: char.icon ?? '',
          type: 'assistant',
        },
        ...previous_message,
      ]);
    }
  }, [char, firstMessage, previous_message, setMessages, messages.length]);

  return (
    <Suspense fallback={<ChatPageSpinner />}>
      <div
        className={`flex justify-center items-center w-full h-full ${className}`}
      >
        <ChatMain
          user={user}
          char={char}
          previous_message={messages}
          isGenerating={isGenerating}
          messagesEndRef={messagesEndRef}
          setMessages={setMessages}
          messageIdRef={messageIdRef}
          setIsGenerating={setIsGenerating}
          conversation_id={conversation_id}
        />
      </div>
    </Suspense>
  );
}
