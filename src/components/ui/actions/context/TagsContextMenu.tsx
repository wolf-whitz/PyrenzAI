import React, { useState, useMemo, useEffect } from 'react';
import { Menu, MenuItem, Typography, TextField, Box } from '@mui/material';
import { Utils as utils } from '~/utility';

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
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTags = async () => {
    try {
      const { data } = await utils.db.select<Tag>({
        tables: 'tags',
        columns: '*',
      });
      if (data) setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    if (anchorEl) fetchTags();
  }, [anchorEl]);

  const filteredTags = useMemo(() => {
    return tags.filter(
      (tag) =>
        tag.tag_name &&
        typeof tag.tag_name === 'string' &&
        tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
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
