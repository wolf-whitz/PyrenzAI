import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Box,
  Modal,
  Backdrop,
  Fade,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '~/Utility/supabaseClient';

interface MoreButtonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onButtonTagClicked: (tag: string) => void;
}

export function MoreButtonsModal({
  isOpen,
  onClose,
  onButtonTagClicked,
}: MoreButtonsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      let query = supabase.from('tags').select('tag_name');

      if (searchQuery) {
        query = query.ilike('tag_name', `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);

      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        setTags(data.map((tag) => tag.tag_name));
      }
      setIsLoading(false);
    };

    const timer = setTimeout(() => {
      fetchTags();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTagClick = (tag: string) => {
    onButtonTagClicked(tag);
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
      BackdropProps={{ timeout: 500 }}
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
            p: 4,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            color: 'white',
          }}
        >
          <TextField
            placeholder="Search for characters via tags, Male, Female, etc!"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start">
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <SearchIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              style: { color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#ccc' },
            }}
          />

          <Divider
            sx={{
              my: 2,
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          />

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleTagClick(tag)}
                sx={{
                  borderColor: 'rgba(173, 216, 230, 0.6)',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  '&:hover': {
                    borderColor: '#add8e6',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
