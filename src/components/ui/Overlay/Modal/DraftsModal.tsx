import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { Draft } from '@shared-types';

interface DraftsModalProps {
  onClose: () => void;
  onSelect: (draft: Draft) => void;
}

const SkeletonLoader = () => (
  <Card className="bg-gray-800 p-4 rounded-lg mb-4 animate-pulse">
    <CardContent>
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </CardContent>
  </Card>
);

export function DraftsModal({ onClose, onSelect }: DraftsModalProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedDrafts, setDisplayedDrafts] = useState<Draft[]>([]);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
    };

    fetchUserUuid();
  }, []);

  useEffect(() => {
    const fetchDrafts = async () => {
      if (hasFetched.current || !userUuid) return;
      hasFetched.current = true;

      try {
        const { data, error } = await supabase
          .from('draft_characters')
          .select('*')
          .eq('user_uuid', userUuid);

        if (error) {
          console.error('Error fetching drafts:', error);
          return;
        }

        const mappedDrafts: Draft[] = data.map((draft: any) => {
          const tags = Array.isArray(draft.tags)
            ? draft.tags
            : (draft.tags as string)
                .split(',')
                .map((tag: string) => tag.trim());
          return { ...draft, tags };
        });

        setDrafts(mappedDrafts);
        setDisplayedDrafts(mappedDrafts.slice(0, 3));
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [userUuid]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const nextDrafts = drafts.slice(nextPage * 3, (nextPage + 1) * 3);
    if (nextDrafts.length > 0) {
      setDisplayedDrafts(nextDrafts);
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      const prevDrafts = drafts.slice(prevPage * 3, (prevPage + 1) * 3);
      setDisplayedDrafts(prevDrafts);
      setCurrentPage(prevPage);
    }
  };

  const handleRemoveDraft = async (draftId: number) => {
    try {
      const { error } = await supabase
        .from('draft_characters')
        .delete()
        .eq('id', draftId);

      if (error) {
        console.error('Error removing draft:', error);
        return;
      }

      setDrafts(drafts.filter((draft) => draft.id !== draftId));
      setDisplayedDrafts(
        displayedDrafts.filter((draft) => draft.id !== draftId)
      );
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleSelectDraft = (draft: Draft) => {
    onSelect(draft);
    onClose();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="drafts-modal-title"
      aria-describedby="drafts-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={true}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: 'md',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            p: 4,
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <Typography
              variant="h5"
              component="h2"
              className="text-center mb-4 text-white"
            >
              Select a Draft
            </Typography>
            {loading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : displayedDrafts.length === 0 ? (
              <Typography variant="body1" className="text-center text-gray-300">
                No drafts available.
              </Typography>
            ) : (
              <>
                {displayedDrafts.map((draft) => (
                  <Card
                    key={draft.id}
                    className="mb-4"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: '12px',
                      color: '#fff',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                    onClick={() => handleSelectDraft(draft)}
                  >
                    <CardActions sx={{ position: 'absolute', top: 0, right: 0 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDraft(draft.id);
                        }}
                        sx={{ color: '#f87171', '&:hover': { color: '#ef4444' } }}
                      >
                        <Trash />
                      </IconButton>
                    </CardActions>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {draft.name || 'Untitled Draft'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#d1d5db', mb: 1 }}>
                        {draft.description || 'No description available.'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Created at: {new Date(draft.created_at).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="text-white p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                    startIcon={<ChevronLeft />}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={(currentPage + 1) * 3 >= drafts.length}
                    className="text-white p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                    endIcon={<ChevronRight />}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
