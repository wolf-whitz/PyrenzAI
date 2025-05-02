import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store/index';
import { Sparkles, RefreshCw, Flame, Tag } from 'lucide-react';
import { Button, TextField, CircularProgress, Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

type MoreButtonsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: (
    rpcFunction: string,
    type: string,
    max_character: number,
    page: number
  ) => void;
};

const buttons: ButtonType[] = [
  {
    icon: Sparkles,
    label: 'HomePageMoreButtons.btn.latest',
    rpcFunction: 'get_latest_characters',
    type: 'GetLatestCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: RefreshCw,
    label: 'HomePageMoreButtons.btn.random',
    rpcFunction: 'get_random_characters',
    type: 'GetRandomCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Flame,
    label: 'HomePageMoreButtons.btn.hot',
    rpcFunction: 'get_hot_characters',
    type: 'GetHotCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Tag,
    label: 'HomePageMoreButtons.btn.male',
    rpcFunction: 'get_male_characters',
    type: 'GetMaleCharacter',
    max_character: 10,
    page: 1,
  },
];

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center">
    <CircularProgress />
  </Box>
);

export default function MoreButtonsModal({
  isOpen,
  onClose,
  onButtonClick,
}: MoreButtonsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalResults, setModalResults] = useState<ModalResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const user_uuid = useUserStore((state) => state.user_uuid);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const { t } = useTranslation();

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
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const filteredModalButtons =
    modalResults.length > 0
      ? modalResults
      : buttons.filter((btn) =>
          t(btn.label).toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleButtonClick = async (btn: ModalResultType | ButtonType) => {
    if ('rpcFunction' in btn && 'type' in btn) {
      onButtonClick(
        btn.rpcFunction,
        btn.type,
        btn.max_character || 10,
        btn.page || 1
      );
    } else {
      const { data } = await supabase.rpc('get_tagged_characters', {
        type: 'GetTaggedCharacters',
        item: btn.name,
      });
      setModalResults(data || []);
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="more-buttons-modal"
      aria-describedby="more-buttons-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        style={{
          backgroundColor: '#000',
          padding: '1.5rem',
          borderRadius: '0.375rem',
          border: '1px solid #fff',
          width: '100%',
          maxWidth: '20rem',
        }}
      >
        <TextField
          label={t('search.placeholder')}
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          InputProps={{
            style: { color: '#fff', borderColor: '#fff' },
          }}
          InputLabelProps={{
            style: { color: '#fff' },
          }}
          sx={{ marginBottom: '1rem' }}
        />
        <Box display="flex" flexDirection="column" gap={2}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            filteredModalButtons.map((btn, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={
                    'icon' in btn ? <btn.icon size={24} /> : <Tag size={24} />
                  }
                  onClick={() => handleButtonClick(btn)}
                  fullWidth
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {'icon' in btn ? t(btn.label) : btn.name}
                </Button>
              </motion.div>
            ))
          )}
        </Box>
      </motion.div>
    </Modal>,
    document.getElementById('modal-root')!
  );
}
