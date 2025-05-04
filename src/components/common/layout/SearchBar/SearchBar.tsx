import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useTranslation } from 'react-i18next';
import { supabase } from '~/Utility/supabaseClient';

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
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchNSFWSetting = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_data')
        .select('show_nsfw_content')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error('Error fetching NSFW setting:', error);
        setLoading(false);
        return;
      }

      setNsfwEnabled(!!data?.show_nsfw_content);
      setLoading(false);
    };

    fetchNSFWSetting();
  }, []);

  const handleSearch = () => {
    setSearch(inputValue);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleNSFW = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNsfwState = event.target.checked;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_data')
      .update({ show_nsfw_content: newNsfwState })
      .eq('user_uuid', user.id);

    if (error) {
      console.error('Error updating NSFW setting:', error);
      return;
    }

    setNsfwEnabled(newNsfwState);
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
          placeholder={t('search.placeholder')}
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
              fontSize: '1rem',
            },
          }}
          className="w-full sm:w-auto"
        />
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={handleSearch}
          aria-label={t('ariaLabels.search')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {!loading && (
        <FormGroup className="flex items-center">
          <FormControlLabel
            control={
              <Switch
                checked={nsfwEnabled}
                onChange={toggleNSFW}
                color="primary"
                aria-label={t('ariaLabels.nsfwToggle')}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#ec4899',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#ec4899',
                  },
                }}
              />
            }
            label={t('labels.showNsfwContent')}
            labelPlacement="start"
            sx={{
              margin: 0,
              color: 'white',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          />
        </FormGroup>
      )}
    </div>
  );
}
