import { useState, ChangeEvent, KeyboardEvent } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
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
  const { t } = useTranslation();

  const handleSearch = () => {
    setSearch(inputValue);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
      <div className="relative w-full sm:w-auto flex-1">
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
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '9999px',
              backgroundColor: '#1F2937',
              color: 'white',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': {
                border: '2px solid #3B82F6',
              },
            },
          }}
          sx={{
            input: {
              padding: '0.75rem 0.75rem 0.75rem 0',
              fontSize: '1rem',
            },
          }}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
