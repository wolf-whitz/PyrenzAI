import { useEffect, useState, Suspense } from 'react';
import { useChatStore, useUserStore } from '~/store';
import { ChatPageSpinner, ChatMain } from '@components';
import clsx from 'clsx';

interface ChatContainerProps {
  className?: string;
  chat_uuid: string;
}

export function ChatContainer({
  className = '',
  chat_uuid,
}: ChatContainerProps) {
  const { char, user } = useChatStore();
  const { imageURL } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      if (imageURL) {
        setBgImage(imageURL);
      } else if (char?.profile_image) {
        setBgImage(char.profile_image);
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
          { 'bg-cover': !!bgImage }
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
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            chat_uuid={chat_uuid}
          />
        )}
      </div>
    </Suspense>
  );
}
