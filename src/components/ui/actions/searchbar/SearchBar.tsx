import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

export function SearchBar({
  search,
  setSearch,
  setCurrentPage,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(search);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (inputValue.trim() === '') {
      timerRef.current = setTimeout(() => {
        setSearch('');
        setCurrentPage(1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputValue]);

  const handleSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(true);

    setTimeout(() => {
      setSearch(inputValue.trim());
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={4}
        width="100%"
      >
        <Box position="relative" width={{ xs: '100%', sm: 'auto' }} flex={1}>
          <TextField
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Who do you want to chat with?"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ marginRight: '8px' }}>
                  <IconButton
                    onClick={handleSearch}
                    edge="start"
                    sx={{ padding: '8px', color: 'grey' }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <SearchIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '10px',
                backgroundColor: '#1F2937',
                color: 'white',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '& input': {
                  backgroundColor: 'transparent',
                  color: 'white',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #1F2937 inset',
                  WebkitTextFillColor: 'white',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
            }}
            sx={{
              input: {
                padding: '0.75rem 0.75rem 0.75rem 0',
                fontSize: '1rem',
              },
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
}
