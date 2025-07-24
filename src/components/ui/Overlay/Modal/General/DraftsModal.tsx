import React, { useEffect, useState, useRef } from 'react';
import {
  Typography,
  IconButton,
  Button,
  CardContent,
  CardActions,
  Box,
  MenuItem,
} from '@mui/material';
import {
  ChevronLeftOutlined as ChevronLeftIcon,
  ChevronRightOutlined as ChevronRightIcon,
  MoreVert as MoreVertIcon,
  DeleteOutlined as DeleteIcon,
} from '@mui/icons-material';
import { GetUserUUID } from '@components';
import { Draft } from '@shared-types';
import {
  PyrenzModal,
  PyrenzModalContent,
  PyrenzCard,
  PyrenzMenu,
} from '~/theme';
import { Utils } from '~/Utility';

interface DraftsModalProps {
  onClose: () => void;
  onSelect: (draft: Draft) => void;
}

const ITEMS_PER_PAGE = 3;

export function DraftsModal({ onClose, onSelect }: DraftsModalProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedDrafts, setDisplayedDrafts] = useState<Draft[]>([]);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserUuid = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUuid(uuid);
      } catch (err) {
        console.error('Error fetching user UUID:', err);
        setError('Failed to load user data.');
      }
    };
    fetchUserUuid();
  }, []);

  useEffect(() => {
    const fetchDrafts = async () => {
      if (hasFetched.current || !userUuid) return;
      hasFetched.current = true;
      try {
        const { data } = await Utils.db.select<Draft>({
          tables: 'draft_characters',
          columns: '*',
          match: { creator_uuid: userUuid },
        });
        setDrafts(data);
        setDisplayedDrafts(data.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        console.error('Error fetching drafts:', err);
        setError('Failed to load drafts.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [userUuid]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const nextDrafts = drafts.slice(
      nextPage * ITEMS_PER_PAGE,
      (nextPage + 1) * ITEMS_PER_PAGE
    );
    if (nextDrafts.length > 0) {
      setDisplayedDrafts(nextDrafts);
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      const prevDrafts = drafts.slice(
        prevPage * ITEMS_PER_PAGE,
        (prevPage + 1) * ITEMS_PER_PAGE
      );
      setDisplayedDrafts(prevDrafts);
      setCurrentPage(prevPage);
    }
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    draftId: number
  ) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedDraftId(draftId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedDraftId(null);
  };

  const handleRemoveDraft = async () => {
    if (selectedDraftId == null) return;
    try {
      await Utils.db.remove({
        tables: 'draft_characters',
        match: { id: selectedDraftId },
      });
      const updatedDrafts = drafts.filter(
        (draft) => draft.id !== selectedDraftId
      );
      setDrafts(updatedDrafts);
      setDisplayedDrafts(
        updatedDrafts.slice(
          currentPage * ITEMS_PER_PAGE,
          (currentPage + 1) * ITEMS_PER_PAGE
        )
      );
    } catch (err) {
      console.error('Error removing draft:', err);
      setError('Failed to remove draft.');
    } finally {
      handleCloseMenu();
    }
  };

  const handleSelectDraft = (draft: Draft) => {
    onSelect(draft);
    onClose();
  };

  return (
    <PyrenzModal open={true} onClose={onClose}>
      <PyrenzModalContent>
        <Typography
          variant="h5"
          component="h2"
          sx={{ textAlign: 'center', mb: 4, color: 'white' }}
        >
          Select a Draft
        </Typography>

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <PyrenzCard key={i} loading sx={{ mb: 4 }} />
            ))}
          </>
        ) : displayedDrafts.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          >
            No drafts available.
          </Typography>
        ) : (
          <>
            {displayedDrafts.map((draft) => (
              <PyrenzCard
                key={draft.id}
                sx={{
                  mb: 4,
                  color: 'white',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => handleSelectDraft(draft)}
              >
                <CardActions sx={{ position: 'absolute', top: 0, right: 0 }}>
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, draft.id)}
                    sx={{ color: 'white' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardActions>

                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {draft.name || 'Untitled Draft'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 1 }}
                  >
                    {draft.description || 'No description available.'}
                  </Typography>
                </CardContent>
              </PyrenzCard>
            ))}

            <PyrenzMenu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleRemoveDraft}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete Draft
              </MenuItem>
            </PyrenzMenu>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                sx={{
                  color: 'white',
                  p: 2,
                  borderRadius: '8px',
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
                startIcon={<ChevronLeftIcon />}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * ITEMS_PER_PAGE >= drafts.length}
                sx={{
                  color: 'white',
                  p: 2,
                  borderRadius: '8px',
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '&.Mui-disabled': { opacity: 0.5 },
                }}
                endIcon={<ChevronRightIcon />}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
