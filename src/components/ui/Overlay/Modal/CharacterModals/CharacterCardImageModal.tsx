import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { usePyrenzAlert } from '~/provider';
import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton } from '~/theme';

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

  return (
    <PyrenzModal open={isModalOpen} onClose={() => setModalOpen(false)}>
      <PyrenzModalContent>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '4xl',
            height: '100%',
            bgcolor: 'gray.900',
            color: 'white',
            p: 6,
            overflowY: 'auto',
          }}
        >
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'gray.800',
              borderRadius: '50%',
              p: 2,
            }}
          >
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontSize: '1.125rem',
              fontWeight: 'semibold',
              mb: 6,
            }}
          >
            Choose a Character Card
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr',
              },
              gap: 4,
            }}
          >
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <Card
                    key={index}
                    sx={{ bgcolor: 'gray.800', color: 'white' }}
                  >
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
                    sx={{
                      bgcolor: 'gray.800',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCardClick(card.card_image)}
                  >
                    <CardMedia
                      component="img"
                      height="75"
                      image={card.card_image}
                      alt={card.card_name}
                      sx={{ objectFit: 'cover' }}
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
          </Box>

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <PyrenzBlueButton
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
                disabled={loadMoreLoading}
                sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.500' } }}
              >
                {loadMoreLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Show More'
                )}
              </PyrenzBlueButton>
            </Box>
          )}
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
