import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PyrenzAccordionInput, PyrenzDialog } from '~/theme';
import { Utils } from '~/Utility';

interface PersonaData {
  id: string;
  user_uuid: string;
  persona_name: string;
  persona_description: string;
  persona_profile: string;
  is_selected?: boolean;
}

export function Persona() {
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPersonaId, setMenuPersonaId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<PersonaData | null>(
    null
  );

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const {
          data: { user },
        } = await Utils.db.client.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        const user_uuid = user.id;
        const { data } = await Utils.db.select<PersonaData>({
          tables: 'personas',
          columns: '*',
          match: { user_uuid },
        });
        setPersonas(data ?? []);
      } catch (error) {
        console.error('Failed to fetch personas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    personaId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuPersonaId(personaId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPersonaId(null);
  };

  const handleSelect = async (selectedId: string) => {
    try {
      const {
        data: { user },
      } = await Utils.db.client.auth.getUser();
      if (!user) throw new Error('Not logged in');
      const user_uuid = user.id;

      await Utils.db.update({
        tables: 'personas',
        values: { is_selected: false },
        match: { user_uuid },
      });

      await Utils.db.update({
        tables: 'personas',
        values: { is_selected: true },
        match: { id: selectedId },
      });

      setPersonas((prev) =>
        prev.map((p) => ({ ...p, is_selected: p.id === selectedId }))
      );
    } catch (err) {
      console.error('Error selecting persona:', err);
    } finally {
      handleMenuClose();
    }
  };

  const handleDeleteClick = (persona: PersonaData) => {
    setPersonaToDelete(persona);
    setConfirmDeleteOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setConfirmDeleteOpen(false);
    setPersonaToDelete(null);
  };

  const handleDialogConfirm = async () => {
    if (!personaToDelete) return;

    try {
      await Utils.db.remove({
        tables: 'personas',
        match: { id: personaToDelete.id },
      });

      setPersonas((prev) => prev.filter((p) => p.id !== personaToDelete.id));
    } catch (error) {
      console.error('Error deleting persona:', error);
    } finally {
      handleDialogClose();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <PyrenzAccordionInput label="Persona">
        <Box display="flex" flexDirection="column" gap={2}>
          {personas.map((persona) => (
            <Paper
              key={persona.id}
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: '12px',
                backgroundColor: '#2a2a2a',
                color: '#fff',
                border: persona.is_selected
                  ? '2px solid #42a5f5'
                  : '2px solid transparent',
              }}
            >
              <Avatar
                alt={persona.persona_name}
                src={persona.persona_profile}
                sx={{
                  width: 72,
                  height: 72,
                  border: '2px solid #add8e6',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              />
              <Box display="flex" flexDirection="column" flex={1}>
                <Typography variant="h6" fontWeight={600}>
                  {persona.persona_name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  {persona.persona_description.slice(0, 250)}
                  {persona.persona_description.length > 250 && '...'}
                </Typography>
              </Box>
              <IconButton onClick={(e) => handleMenuClick(e, persona.id)}>
                <MoreVertIcon sx={{ color: '#fff' }} />
              </IconButton>
            </Paper>
          ))}
        </Box>
      </PyrenzAccordionInput>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2a2a2a',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      >
        <MenuItem onClick={() => menuPersonaId && handleSelect(menuPersonaId)}>
          Select
        </MenuItem>
        <MenuItem
          onClick={() => {
            const target = personas.find((p) => p.id === menuPersonaId);
            if (target) handleDeleteClick(target);
          }}
          sx={{ color: 'red' }}
        >
          Delete
        </MenuItem>
      </Menu>
      <PyrenzDialog
        open={confirmDeleteOpen}
        onClose={handleDialogClose}
        title="Delete Persona?"
        content="Are you sure you want to delete this persona? This action cannot be undone."
        onConfirm={handleDialogConfirm}
      />
    </Box>
  );
}
