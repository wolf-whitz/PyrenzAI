import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  CircularProgress,
  Box,
  Modal,
  Backdrop,
  Fade,
  Typography,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ButtonType, ModalResultType } from '@shared-types';
import { Tag, Search } from 'lucide-react';

interface MoreButtonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: (functionName: string, type: string, maxCharacter?: number, page?: number, tag?: string) => void;
  buttons: ButtonType[];
  onQuery: (query: string) => void;
  modalResults: ModalResultType[];
  loading: boolean;
  searchQuery: string;
}

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
  onQuery,
  modalResults,
  loading: propLoading,
  searchQuery: propSearchQuery,
}: MoreButtonsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(propSearchQuery);
  const [loading, setLoading] = useState(propLoading);

  React.useEffect(() => {
    setSearchQuery(propSearchQuery);
  }, [propSearchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    setLoading(true);
    onQuery(searchQuery);
    setLoading(false);
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const filteredModalButtons = modalResults.length > 0 ? modalResults : buttons;

  const handleButtonClick = (btn: ModalResultType | ButtonType) => {
    if ('Function' in btn && 'type' in btn) {
      onButtonClick(
        btn.Function,
        btn.type,
        btn.max_character || 10,
        btn.page || 1,
        btn.tag
      );
    } else {
      onQuery(btn.name);
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
            width: '80%',
            maxWidth: '400px',
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
              placeholder="Search for characters via tags, Male, Female, etc!"
              value={searchQuery}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleSearchSubmit} edge="start">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex flex-col gap-2">
              {loading ? (
                <LoadingSpinner />
              ) : filteredModalButtons.length > 0 ? (
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
              ) : (
                <Typography variant="body1" align="center">
                  No tags found
                </Typography>
              )}
            </div>
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
