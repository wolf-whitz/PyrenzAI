import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '~/Utility/supabaseClient';
import { PyrenzModal, PyrenzModalContent } from '~/theme';

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
    <PyrenzModal open={isOpen} onClose={onClose}>
      <PyrenzModalContent ref={modalRef}>
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
                  {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
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
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
