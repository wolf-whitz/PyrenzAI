import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchCharacters } from '~/functions';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  user_uuid: string;
  onLoadMore: (page: number) => void;
}

export default function Pagination({
  currentPage,
  itemsPerPage,
  onLoadMore,
}: PaginationProps) {
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const searchQuery = searchParams.get('search') || '';
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleLoadMore = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { characters } = await fetchCharacters(
        'character',
        searchQuery || null,
        currentPage + 1,
        itemsPerPage
      );

      if (characters.length > 0) {
        onLoadMore(currentPage + 1);
      } else {
        toast.success('No more characters to load.');
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      Sentry.captureException(error);
      toast.error('Error fetching characters.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '2rem',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="contained"
          onClick={handleLoadMore}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#4a5568' : '#2d3748',
            color: '#fff',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          aria-label={t('ariaLabels.loadMore')}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('buttons.loadMore')
          )}
        </Button>
      </motion.div>
    </div>
  );
}
