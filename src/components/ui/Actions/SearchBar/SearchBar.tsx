import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';

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
  const { t } = useTranslation();

  useEffect(() => {
    if (inputValue.trim() === '') {
      const timer = setTimeout(() => {
        setSearch('');
        setCurrentPage(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inputValue, setSearch, setCurrentPage]);

  const handleSearch = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setSearch(inputValue);
      setCurrentPage(1);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
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
                  {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '9999px',
              backgroundColor: '#1F2937',
              color: 'white',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
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
  );
}
