import React, { useState, useMemo } from 'react';
import { Menu, MenuItem, Typography, TextField } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { Tag } from '@shared-types';

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
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
      <div className="p-2">
        <TextField
          label="Search Tags"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-2"
          placeholder="Search for tags e.g., fantasy"
        />
        <div className="max-h-96 overflow-y-auto">
          {filteredTags.map((tag) => (
            <MenuItem
              key={tag.id}
              onClick={() => onTagClick(tag.name)}
              className="rounded-md hover:bg-blue-500 hover:text-white"
            >
              <Typography variant="body1">{tag.name}</Typography>
            </MenuItem>
          ))}
        </div>
      </div>
    </Menu>
  );
}
