import { useNavigate, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { motion } from 'framer-motion';
import { Button, CircularProgress } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  user_param_uuid: string;
  onLoadMore: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  user_param_uuid,
  onLoadMore,
}: PaginationProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('fetch_characters', {
        request_type: 'character',
        page: currentPage + 1,
        items_per_page: itemsPerPage,
        search_term: searchQuery || null,
        user_param_uuid: user_param_uuid,
      });

      if (error) {
        throw error;
      }

      if (data.length > 0) {
        onLoadMore(currentPage + 1);
      } else {
        console.log('No more characters to load.');
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
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
          aria-label="Load more items"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Load More'}
        </Button>
      </motion.div>
    </div>
  );
}
