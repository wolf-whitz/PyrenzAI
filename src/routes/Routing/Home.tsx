import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import {
  Sidebar,
  Banner,
  SearchBar,
  CharacterCard,
  LoadMore,
  Footer,
  CustomButton,
  SkeletonCard,
} from '~/components';
import { useHomeStore } from '~/store';
import { useUserStore } from '~/store';
import { fetchCharacters } from '~/api';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types/CharacterProp';
import { Box, Typography, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    search,
    currentPage,
    characters,
    total,
    loading,
    bgImage,
    setSearch,
    setCurrentPage,
    setCharacters,
    setTotal,
    setLoading,
  } = useHomeStore();

  const { user_uuid } = useUserStore();
  const { t } = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useEffect(() => {
    setIsClient(true);
    setSearch(searchParams.get('search') || '');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams, setSearch, setCurrentPage]);

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    try {
      const { characters, total } = await fetchCharacters(
        currentPage,
        itemsPerPage,
        search,
        user_uuid || ''
      );
      setCharacters(characters);
      setTotal(total);
    } catch (error) {
      toast.error(t('errors.fetchingCharacters'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, itemsPerPage, user_uuid, setCharacters, setTotal, setLoading, t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCharactersData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchCharactersData]);

  useEffect(() => {
    navigate(`?page=${currentPage}&search=${encodeURIComponent(search)}`, {
      replace: true,
    });
  }, [currentPage, search, navigate]);

  const handleButtonClick = async (
    rpcFunction: string,
    type: string,
    max_character: number,
    page: number
  ) => {
    setLoading(true);
    setCharacters([]);
    try {
      const { data, error } = await supabase.rpc(rpcFunction, {
        type,
        max_character,
        page,
      });
      if (error) throw error;
      setCharacters(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('errors.callingRPCFunction') + error.message);
      } else {
        toast.error(t('errors.unknown'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col bg-midnight min-h-screen text-white font-baloo"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: bgImage ? 'cover' : 'auto',
        backgroundPosition: bgImage ? 'center' : 'unset',
      }}
      aria-label={t('ariaLabels.homePage')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth={false} disableGutters className="flex flex-1 flex-col md:flex-row">
        <Box className="hidden md:flex md:pl-[50px]">
          <Sidebar />
        </Box>
        <Box className="p-6 flex-1">
          <Banner />
          <SearchBar
            search={search}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
            aria-label={t('ariaLabels.searchCharacters')}
          />

          <CustomButton
            onButtonClick={handleButtonClick}
            aria-label={t('ariaLabels.customActionButton')}
          />

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SkeletonCard
                      key={i}
                      aria-label={t('ariaLabels.loadingCharacter', { index: i + 1 })}
                    />
                  </motion.div>
                ))
              ) : characters.length > 0 ? (
                characters.map((char: Character) => (
                  <Box
                    key={char.id}
                    data-character-uuid={char.input_char_uuid}
                    data-character-id={char.id}
                    className="transition-transform hover:scale-105"
                    aria-labelledby={`character-${char.name}`}
                    style={{ order: char.id }}
                  >
                    <CharacterCard {...char} />
                  </Box>
                ))
              ) : (
                <motion.div
                  className="text-gray-500 text-center w-full"
                  aria-live="polite"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="body1">
                    {t('messages.noCharactersFound')}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <LoadMore
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            user_param_uuid={user_uuid || ''}
            onLoadMore={setCurrentPage}
          />
        </Box>
      </Container>
      <Box className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around p-2 shadow-lg z-50 md:hidden">
        <Sidebar />
      </Box>
      <Box className="pb-16 px-4">
        {isClient && <Footer />}
        <Typography variant="body2" className="text-center text-gray-500 mt-4">
          © 2025 Pyrenz AI. {t('messages.allRightsReserved')}
        </Typography>
      </Box>
      <ToastContainer />
    </motion.div>
  );
}
