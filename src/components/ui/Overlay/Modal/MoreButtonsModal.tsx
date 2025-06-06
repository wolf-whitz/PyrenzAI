import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GetCharactersWithTags } from '@components';
import {
  ButtonType,
  ModalResultType,
  MoreButtonsModalProps,
} from '@shared-types';
import { Tag } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <CircularProgress />
  </div>
);

export function MoreButtonsModal({
  isOpen,
  onClose,
  onButtonClick,
  buttons,
}: MoreButtonsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalResults, setModalResults] = useState<ModalResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
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
        try {
          const data = await GetCharactersWithTags(
            10,
            1,
            'GetTaggedCharacters',
            query
          );
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
        const data = await GetCharactersWithTags(
          10,
          1,
          'GetTaggedCharacters',
          btn.name
        );
        setModalResults(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="more-buttons-modal"
      aria-describedby="more-buttons-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box
          ref={modalRef}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 'xs',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
            border: '1px solid #add8e6',
          }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
          >
            <TextField
              label={t('search.placeholder')}
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              fullWidth
              InputProps={{
                className: 'text-white border-white',
              }}
              InputLabelProps={{
                className: 'text-white',
              }}
              className="mb-4"
            />
            <div className="flex flex-col gap-2">
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
                        'icon' in btn && btn.icon ? (
                          React.createElement(btn.icon, { size: 24 })
                        ) : (
                          <Tag size={24} />
                        )
                      }
                      onClick={() => handleButtonClick(btn)}
                      fullWidth
                      className="justify-start normal-case text-base"
                      sx={{
                        borderColor: '#add8e6',
                        color: '#fff',
                        '&:hover': {
                          borderColor: '#add8e6',
                        },
                      }}
                    >
                      {'icon' in btn ? t(btn.label) : btn.name}
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
