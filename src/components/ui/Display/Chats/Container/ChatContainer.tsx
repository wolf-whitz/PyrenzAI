import { useEffect, useRef, useState, Suspense } from 'react';
import { useChatStore, useUserStore } from '~/store';
import { Message, ChatContainerProps, Character, User } from '@shared-types';
import { ChatPageSpinner, ChatMain } from '@components';
import clsx from 'clsx';

interface ChatContainerPropsExtended extends Omit<ChatContainerProps, 'char' | 'firstMessage'> {
  className?: string;
  chat_uuid: string;
}

export function ChatContainer({ className = '', chat_uuid }: ChatContainerPropsExtended) {
  const { messages, setMessages, firstMessage, user, char } = useChatStore();
  const { imageURL } = useUserStore();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      if (imageURL) {
        setBgImage(imageURL);
      } else if (char?.profile_image) {
        setBgImage(char?.profile_image);
      }
      setIsLoading(false);
    };

    loadImage();
  }, [imageURL, char?.profile_image]);

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
        {isLoading && <ChatPageSpinner />}
        {!isLoading && (
          <ChatMain
            user={user as User }
            char={char as Character}
            firstMessage={firstMessage}
            previous_message={messages}
            isGenerating={isGenerating}
            setMessages={setMessages}
            setIsGenerating={setIsGenerating}
            chat_uuid={chat_uuid}
          />
        )}
      </div>
    </Suspense>
  );
}
