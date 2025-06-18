import React, { useState, useMemo } from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  TextField,
  Box
} from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';

interface Tag {
  id: number;
  tag_name: string;
  user_uuid: string;
  created_at: string;
  char_uuid: string;
}

interface TagsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

export function TagsMenu({ anchorEl, onClose, onTagClick }: TagsMenuProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTags = useMemo(() => {
    return tags.filter((tag) => {
      return tag.tag_name && typeof tag.tag_name === 'string' && tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [tags, searchQuery]);

  const fetchTags = async () => {
    const { data, error } = await supabase.from('tags').select('*');
    if (data) {
      setTags(data);
    }
    if (error) {
      console.error('Error fetching tags:', error);
    }
  };

  React.useEffect(() => {
    if (anchorEl) {
      fetchTags();
    }
  }, [anchorEl]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        style: {
          maxHeight: 400,
          width: '20ch',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          label="Search Tags"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          placeholder="Search for tags e.g., Fantasy"
        />
        <Box
          style={{
            maxHeight: 300,
            overflow: 'auto',
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For Internet Explorer and Edge
          }}
        >
          {filteredTags.map((tag) => (
            <MenuItem
              key={tag.id}
              onClick={() => onTagClick(tag.tag_name)}
              sx={{
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'blue',
                  color: 'white',
                },
              }}
            >
              <Typography variant="body1">{tag.tag_name}</Typography>
            </MenuItem>
          ))}
        </Box>
      </Box>
    </Menu>
  );
}
