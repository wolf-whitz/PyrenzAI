import React, { useState } from 'react';
import { Typography, IconButton, MenuItem, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { PyrenzMenu, PyrenzCard } from '~/theme';

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

  const truncateDescription = (description: string, limit: number = 100) =>
    description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;

  return (
    <PyrenzCard selected={is_selected}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="start"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {persona_profile && (
            <Box
              component="img"
              src={persona_profile}
              alt={persona_name}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
          <Typography
            variant="subtitle1"
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.05rem',
              lineHeight: 1.2,
            }}
          >
            {persona_name}
          </Typography>
        </Box>
        <IconButton onClick={handleMenuOpen} sx={{ color: '#aaa' }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: '#aaa',
          mt: 1.5,
          fontSize: '0.88rem',
          lineHeight: 1.5,
        }}
      >
        {truncateDescription(persona_description)}
      </Typography>

      {is_selected && (
        <Typography
          variant="body2"
          sx={{
            color: '#4ea7f7',
            mt: 1,
            fontSize: '0.85rem',
            fontStyle: 'italic',
          }}
        >
          Default Persona
        </Typography>
      )}

      <PyrenzMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSelect}>Select</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </PyrenzMenu>
    </PyrenzCard>
  );
}
