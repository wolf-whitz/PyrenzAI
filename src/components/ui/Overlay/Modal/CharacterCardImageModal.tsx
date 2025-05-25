import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Box,
  Typography,
  Modal,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Button,
} from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { X } from 'lucide-react';
import { usePyrenzAlert } from '~/provider';  

interface CharacterCard {
  id: string;
  card_name: string;
  card_description: string;
  card_image: string;
}

interface CharacterCardImageModalProps {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setCreatePersonaModalOpen: (open: boolean) => void;
  setSelectedImage: (image: string) => void;
}

export function CharacterCardImageModal({
  isModalOpen,
  setModalOpen,
  setCreatePersonaModalOpen,
  setSelectedImage,
}: CharacterCardImageModalProps) {
  const [characterCards, setCharacterCards] = useState<CharacterCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const showAlert = usePyrenzAlert(); 

  const fetchCharacterCards = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    setLoading(page === 1);
    setLoadMoreLoading(page > 1);
    try {
      const { data, error } = await supabase
        .from('persona_cards')
        .select('id, card_name, card_description, card_image')
        .range((page - 1) * 5, page * 5 - 1);

      if (error) {
        throw error;
      }

      if (data.length < 5) {
        setHasMore(false);
      }

      setCharacterCards((prevCards) => [
        ...prevCards,
        ...data.filter((card) => card.card_image),
      ]);
    } catch (error) {
      console.error('Failed to fetch character cards', error);
      showAlert('Failed to fetch character cards. Please try again.', 'Alert'); 
      Sentry.captureException(error);
    } finally {
      setIsFetching(false);
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setPage(1);
      setCharacterCards([]);
      setHasMore(true);
      fetchCharacterCards(1);
    }
  }, [isModalOpen]);

  const handleLoadMore = () => {
    fetchCharacterCards(page + 1);
    setPage((prevPage) => prevPage + 1);
  };

  const handleCardClick = (cardImage: string) => {
    setSelectedImage(cardImage);
    setModalOpen(false);
    setCreatePersonaModalOpen(true);
  };

  const handleImageError = (cardId: string) => {
    setCharacterCards((prevCards) =>
      prevCards.filter((card) => card.id !== cardId)
    );
  };

  if (!isModalOpen) return null;

  return ReactDOM.createPortal(
    <>
      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="character-card-image-modal"
        aria-describedby="character-card-image-modal-description"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Box className="w-full max-w-4xl h-full bg-gray-900 text-white shadow-xl rounded-xl p-6 overflow-y-auto relative">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <Typography
            variant="h6"
            className="text-center text-lg font-semibold mb-6"
          >
            Choose a Character Card
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <Card key={index} className="bg-gray-800 text-white">
                    <Skeleton variant="rectangular" height={100} />
                    <CardContent>
                      <Skeleton variant="text" height={18} width="80%" />
                      <Skeleton variant="text" height={14} width="60%" />
                    </CardContent>
                  </Card>
                ))
              : characterCards.map((card) => (
                  <Card
                    key={card.id}
                    className="bg-gray-800 text-white cursor-pointer"
                    onClick={() => handleCardClick(card.card_image)}
                  >
                    <CardMedia
                      component="img"
                      height="75"
                      image={card.card_image}
                      alt={card.card_name}
                      className="object-cover"
                      onError={() => handleImageError(card.id)}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">
                        {card.card_name}
                      </Typography>
                      <Typography variant="body2">
                        {card.card_description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
                disabled={loadMoreLoading}
                className="bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                {loadMoreLoading ? (
                  <CircularProgress size={24} className="text-white" />
                ) : (
                  'Show More'
                )}
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </>,
    document.getElementById('modal-root')!
  );
}
