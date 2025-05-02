import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const MemoizedCharacterCard = memo(CharacterCard);

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
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

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    const currentPageParam = Number(searchParams.get('page')) || 1;

    if (search !== currentSearch || currentPage !== currentPageParam) {
      setSearch(currentSearch);
      setCurrentPage(currentPageParam);
    }
  }, [searchParams, search, currentPage, setSearch, setCurrentPage]);

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
    fetchCharactersData();
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
      <Container
        maxWidth={false}
        disableGutters
        className="flex flex-1 flex-col md:flex-row"
      >
        <aside className="hidden md:flex md:pl-[50px]">
          <Sidebar />
        </aside>
        <main className="p-6 flex-1 flex flex-col items-center">
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
            className="mx-auto grid w-full gap-x-6 gap-y-4 pb-4 min-h-[50vh]
lg:gap-2
grid-cols-2
md:grid-cols-3
lg:grid-cols-4
xl:grid-cols-5
2xl:grid-cols-6
"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                    >
                      <SkeletonCard
                        key={i}
                        aria-label={t('ariaLabels.loadingCharacter', {
                          index: i + 1,
                        })}
                      />
                    </motion.div>
                  ))
                : characters.length > 0
                ? characters.map((char: Character) => (
                    <motion.div
                      key={char.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="transition-transform hover:scale-105 p-2"
                      aria-labelledby={`character-${char.name}`}
                      style={{ order: char.id }}
                    >
                      <MemoizedCharacterCard {...char} isLoading={loading} is_public={char.is_public} />
                    </motion.div>
                  ))
                : (
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
        </main>
      </Container>
      <aside className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around p-2 shadow-lg z-50 md:hidden">
        <Sidebar />
      </aside>
      <Box className="pb-16 px-4">
        <Footer />
        <Typography variant="body2" className="text-center text-gray-500 mt-4">
          © 2025 Pyrenz AI. {t('messages.allRightsReserved')}
        </Typography>
      </Box>
      <ToastContainer />
    </motion.div>
  );
}
