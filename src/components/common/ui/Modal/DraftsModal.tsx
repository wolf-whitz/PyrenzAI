import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/functions';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Draft } from '@shared-types/CharacterProp';

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

        const mappedDrafts: Draft[] = data.map((draft: any) => ({
          id: draft.id,
          user_uuid: draft.user_uuid,
          persona: draft.persona,
          name: draft.name,
          model_instructions: draft.model_instructions,
          scenario: draft.scenario,
          description: draft.description,
          first_message: draft.first_message,
          tags: Array.isArray(draft.tags)
            ? draft.tags.join(', ')
            : (draft.tags ?? ''),
          gender: draft.gender,
          is_public: draft.is_public,
          is_nsfw: draft.is_nsfw,
          textarea_token: draft.textarea_token,
          token_total: draft.token_total,
          created_at: draft.created_at,
          updated_at: draft.updated_at,
          creator: '',
        }));

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

  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <Typography variant="h5" component="h2" className="text-center mb-4">
          Select a Draft
        </Typography>
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : displayedDrafts.length === 0 ? (
          <Typography variant="body1" className="text-center text-gray-400">
            No drafts available.
          </Typography>
        ) : (
          <>
            {displayedDrafts.map((draft) => (
              <Card
                key={draft.id}
                className="bg-gray-800 p-4 rounded-lg mb-4 relative border border-gray-700 hover:border-gray-500 transition-colors"
              >
                <CardActions className="absolute top-2 right-2">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveDraft(draft.id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash />
                  </IconButton>
                </CardActions>
                <CardContent
                  onClick={() => onSelect(draft)}
                  className="cursor-pointer"
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    className="text-xl font-semibold mb-2"
                  >
                    {draft.name || 'Untitled Draft'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 mb-2">
                    {draft.description || 'No description available.'}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-gray-500 text-sm"
                  >
                    Created at: {new Date(draft.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="text-white p-2 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                startIcon={<ChevronLeft />}
              />
              <Button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * 3 >= drafts.length}
                className="text-white p-2 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                endIcon={<ChevronRight />}
              />
            </div>
          </>
        )}
      </motion.div>
    </motion.div>,
    document.getElementById('modal-root')!
  );
}
