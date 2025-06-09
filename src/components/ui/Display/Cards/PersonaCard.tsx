import React, { useState } from 'react';
import { Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface PersonaCardProps {
  id: string;
  persona_name: string;
  persona_description: string;
  is_selected?: boolean;
  persona_profile?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function PersonaCard({
  id,
  persona_name,
  persona_description,
  is_selected,
  persona_profile,
  onSelect,
  onDelete,
  onEdit,
}: PersonaCardProps) {
  const truncateDescription = (description: string, limit: number = 100) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    onSelect(id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(id);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(id);
    handleMenuClose();
  };

  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 flex flex-col cursor-pointer border-2 ${
        is_selected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {persona_profile && (
            <img
              src={persona_profile}
              alt={`${persona_name}'s profile`}
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <Typography variant="h6" className="text-white">
            {persona_name}
          </Typography>
        </div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MoreVertIcon className="text-white" />
        </IconButton>
      </div>
      <Typography variant="body2" className="text-gray-300">
        {truncateDescription(persona_description)}
      </Typography>
      {is_selected && (
        <Typography variant="body2" className="text-gray-400 mt-2">
          Default Persona
        </Typography>
      )}
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={handleSelect}>Select</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
