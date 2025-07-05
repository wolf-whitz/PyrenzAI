import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PyrenzModal, PyrenzModalContent } from '~/theme';

interface PersonaCard {
  id: string;
  persona_name: string;
  persona_description: string;
  persona_profile: string;
  is_selected: boolean;
}

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaData: PersonaCard[];
  loading: boolean;
  onSelect: (persona: PersonaCard) => void;
  onDelete: (personaId: string) => void;
}

export function PersonaModal({
  isOpen,
  onClose,
  personaData,
  loading,
  onSelect,
  onDelete,
}: PersonaModalProps) {
  const truncateDescription = (description: string, limit: number = 100) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    persona: PersonaCard
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPersona(persona);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPersona(null);
  };

  const handleSelect = () => {
    if (selectedPersona) {
      onSelect(selectedPersona);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedPersona) {
      onDelete(selectedPersona.id);
    }
    handleMenuClose();
  };

  return (
    <PyrenzModal open={isOpen} onClose={onClose}>
      <PyrenzModalContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" className="text-white">
            Personas
          </Typography>
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={4} className="space-y-4">
            {personaData.length > 0 ? (
              personaData.map((persona) => (
                <Box
                  key={persona.id}
                  className="bg-gray-700 rounded-lg p-4"
                  display="flex"
                  flexDirection="row"
                >
                  <Box mr={2}>
                    <img
                      src={persona.persona_profile}
                      alt={persona.persona_name}
                      className="w-20 h-20 rounded-full"
                    />
                  </Box>
                  <Box display="flex" flexDirection="column" flexGrow={1}>
                    <Typography variant="h6" className="text-white">
                      {persona.persona_name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-300 mt-1">
                      {truncateDescription(persona.persona_description)}
                    </Typography>
                  </Box>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, persona)}
                  >
                    <MoreVertIcon className="text-white" />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography variant="body1" className="text-center text-white">
                No persona data available.
              </Typography>
            )}
          </Box>
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
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
