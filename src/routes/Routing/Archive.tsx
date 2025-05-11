import React, { useEffect, useState } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { Sidebar, CustomContextMenu } from '~/components';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type Chat = {
  chat_uuid: string;
  char_uuid: string;
  preview_message: string;
  preview_image: string;
};

type Character = {
  char_uuid: string;
  name: string;
};

export default function ChatArchives() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [characters, setCharacters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('chat_uuid, char_uuid, preview_message, preview_image');

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
        setIsLoading(false);
        return;
      }

      const truncatedChats = chatsData.map((chat: Chat) => ({
        ...chat,
        preview_message:
          chat.preview_message.length > 150
            ? chat.preview_message.substring(0, 150) + '...'
            : chat.preview_message,
      }));

      setChats(truncatedChats);

      const charUuids = [
        ...new Set(chatsData.map((chat: Chat) => chat.char_uuid)),
      ];
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('char_uuid, name')
        .in('char_uuid', charUuids);

      if (charactersError) {
        console.error('Error fetching characters:', charactersError);
        setIsLoading(false);
        return;
      }

      const charactersMap = (charactersData as Character[]).reduce(
        (acc, character) => {
          acc[character.char_uuid] = character.name;
          return acc;
        },
        {} as Record<string, string>
      );

      setCharacters(charactersMap);
      setIsLoading(false);
    };

    fetchChats();
  }, []);

  const handleCardClick = (chatUuid: string) => {
    navigate(`/chat/${chatUuid}`);
  };

  const handleRemoveChat = async (chatUuid: string) => {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('chat_uuid', chatUuid);

    if (error) {
      console.error('Error removing chat:', error);
    } else {
      setChats(chats.filter((chat) => chat.chat_uuid !== chatUuid));
    }
  };

  const handleContextMenu = (event: React.MouseEvent, chat: Chat) => {
    event.preventDefault();
    setContextMenuAnchor({
      top: event.clientY + 2,
      left: event.clientX - 6,
    });
    setSelectedChat(chat);
  };

  const handleCloseContextMenu = () => {
    setContextMenuAnchor(null);
    setSelectedChat(null);
  };

  const contextMenuItems = selectedChat
    ? [
        {
          label: 'Remove Chat',
          action: () => handleRemoveChat(selectedChat.chat_uuid),
        },
      ]
    : [];

  return (
    <motion.div
      className="flex"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
      }}
    >
      <Sidebar />
      <motion.div
        className="flex-1 p-4 flex justify-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
        }}
      >
        <div className="w-full max-w-screen-lg">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <CircularProgress />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Typography variant="h6" color="textSecondary">
                No chats left, maybe start a new one? (⸝⸝&gt; ᴗ•⸝⸝)
              </Typography>
            </div>
          ) : (
            <motion.div
              className="flex flex-wrap -mx-2 justify-center"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {chats.map((chat) => (
                <motion.div
                  key={chat.chat_uuid}
                  className="w-full sm:w-1/2 lg:w-1/2 p-2"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <motion.div
                    onClick={() => handleCardClick(chat.chat_uuid)}
                    onContextMenu={(e) => handleContextMenu(e, chat)}
                    className="cursor-pointer flex"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CardMedia
                      component="img"
                      style={{ width: 100 }}
                      image={chat.preview_image}
                      alt="Preview"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {characters[chat.char_uuid]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {chat.preview_message}
                      </Typography>
                    </CardContent>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {contextMenuAnchor && (
        <CustomContextMenu
          items={contextMenuItems}
          onClose={handleCloseContextMenu}
          anchorPosition={contextMenuAnchor}
        />
      )}
    </motion.div>
  );
}
