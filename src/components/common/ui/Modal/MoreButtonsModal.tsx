import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button, TextField, CircularProgress, Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GetCharactersWithTags } from '~/functions';
import { ButtonType, ModalResultType, MoreButtonsModalProps } from '@shared-types/MoreButtonsTypes';
import { Tag } from 'lucide-react';

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center">
    <CircularProgress />
  </Box>
);

export default function MoreButtonsModal({
  isOpen,
  onClose,
  onButtonClick,
  buttons,
}: MoreButtonsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalResults, setModalResults] = useState<ModalResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (query.trim()) {
      setLoading(true);
      const timeout = setTimeout(async () => {
        try {
          const data = await GetCharactersWithTags(10, 1, 'GetTaggedCharacters', query);
          setModalResults(data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }, 500);

      setTypingTimeout(timeout);
    } else {
      setModalResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
    if ('Function' in btn && 'type' in btn) {
      onButtonClick(
        btn.Function,
        btn.type,
        btn.max_character || 10,
        btn.page || 1,
        btn.tag
      );
    } else {
      try {
        const data = await GetCharactersWithTags(10, 1, 'GetTaggedCharacters', btn.name);
        setModalResults(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
                    'icon' in btn && btn.icon ? React.createElement(btn.icon, { size: 24 }) : <Tag size={24} />
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
