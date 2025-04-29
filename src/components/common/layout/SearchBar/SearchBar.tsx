import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function SearchBar({
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
    <motion.div className="relative w-full mb-6">
      <div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer flex items-center justify-center w-8 h-8 z-10"
        onClick={handleSearch}
      >
        <FaSearch className="text-lg text-gray-400" />
      </div>
      <TextField
        fullWidth
        variant="outlined"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={t('search.placeholder')}
        className="pl-14"
        inputProps={{ className: 'text-white placeholder-gray-400' }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '9999px',
            backgroundColor: '#1F2937',
            color: 'white',
            paddingLeft: '2.75rem',
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': {
              border: '2px solid #3B82F6',
            },
          },
          input: {
            padding: '0.75rem 1rem',
            fontSize: '1.125rem',
            color: 'white',
          },
        }}
      />
    </motion.div>
  );
}
