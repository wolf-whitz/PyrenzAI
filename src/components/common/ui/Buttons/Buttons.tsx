import { Sparkles, RefreshCw, Flame, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { motion } from 'framer-motion';
import { useUserStore } from '~/store/index';

type ButtonType = {
  icon: React.ElementType;
  label: string;
  rpcFunction: string;
  type: string;
  max_character: number;
  page: number;
};

type ModalResultType = {
  name: string;
};

const buttons: ButtonType[] = [
  { icon: Sparkles, label: 'Latest', rpcFunction: 'get_latest_characters', type: 'GetLatestCharacter', max_character: 10, page: 1 },
  { icon: RefreshCw, label: 'Random', rpcFunction: 'get_random_characters', type: 'GetRandomCharacter', max_character: 10, page: 1 },
  { icon: Flame, label: 'Hot', rpcFunction: 'get_hot_characters', type: 'GetHotCharacter', max_character: 10, page: 1 },
  { icon: Tag, label: 'Male', rpcFunction: 'get_male_characters', type: 'GetMaleCharacter', max_character: 10, page: 1 },
];

const LoadingSpinner = () => (
  <motion.div
    className="flex justify-center items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </motion.div>
);

export default function CustomButton({ onButtonClick }: { onButtonClick: Function }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalResults, setModalResults] = useState<ModalResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const user_uuid = useUserStore(state => state.user_uuid);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (query.trim()) {
      setLoading(true);
      const timeout = setTimeout(async () => {
        const { data } = await supabase.rpc('search_tag', {
          search: query,
          type: 'SearchTags',
          user_uuid: user_uuid,
        });
        setModalResults(data || []);
        setLoading(false);
      }, 500);

      setTypingTimeout(timeout);
    } else {
      setModalResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const filteredModalButtons = modalResults.length > 0
    ? modalResults
    : buttons.filter(btn => btn.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleButtonClick = async (btn: ModalResultType | ButtonType) => {
    if ('rpcFunction' in btn && 'type' in btn) {
      onButtonClick(btn.rpcFunction, btn.type, btn.max_character || 10, btn.page || 1);
    } else {
      const { data } = await supabase.rpc('get_tagged_characters', {
        type: 'GetTaggedCharacters',
        item: btn.name,
      });
      setModalResults(data || []);
    }
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="flex justify-center gap-4 mb-6 text-white font-baloo p-4 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {buttons.slice(0, 3).map((btn, index) => (
        <motion.button
          key={index}
          className="border border-white flex items-center space-x-2 rounded-md px-6 py-3 bg-black text-white transform transition-transform duration-300 hover:scale-105 font-baloo"
          onClick={() => onButtonClick(btn.rpcFunction, btn.type, btn.max_character, btn.page)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <btn.icon size={20} />
          <span>{btn.label}</span>
        </motion.button>
      ))}
      <motion.button
        className="border border-white flex items-center space-x-2 rounded-md px-6 py-3 bg-black text-white transform transition-transform duration-300 hover:scale-105 font-baloo"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>More</span>
      </motion.button>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white font-baloo z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-black p-6 rounded-md border border-white w-full max-w-md"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-white bg-black text-white rounded-md p-2 mb-4 w-full font-baloo placeholder-gray-400"
            />
            <div className="flex flex-col gap-4">
              {loading ? (
                <LoadingSpinner />
              ) : (
                filteredModalButtons.map((btn, index) => (
                  <motion.button
                    key={index}
                    className="border border-white flex items-center space-x-2 rounded-md px-6 py-3 bg-black text-white transform transition-transform duration-300 hover:scale-105 font-baloo"
                    onClick={() => handleButtonClick(btn)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {'icon' in btn ? (
                      <>
                        <btn.icon size={20} />
                        <span>{btn.label}</span>
                      </>
                    ) : (
                      <>
                        <Tag size={20} />
                        <span>{btn.name}</span>
                      </>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
