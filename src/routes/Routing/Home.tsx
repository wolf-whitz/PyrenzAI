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
import { fetchCharacters } from '~/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, CharacterCardProps } from '@shared-types/CharacterProp';
import { Box, Typography, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import {
  GetHotCharacters,
  GetUserUUID,
  GetLatestCharacters,
  GetRandomCharacters,
  GetCharactersWithTags,
} from '~/functions';

const MemoizedCharacterCard = memo(CharacterCard);

const transformCharacter = (char: Character): CharacterCardProps => {
  const tagsArray = Array.isArray(char.tags)
    ? char.tags.map((tag) => tag.trim())
    : typeof char.tags === 'string'
      ? char.tags.split(',').map((tag) => tag.trim())
      : [];

  return {
    ...char,
    tags: tagsArray,
    isLoading: false,
  };
};

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

  const { t } = useTranslation();

  const [userUUID, setUserUUID] = useState<string | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useEffect(() => {
    const fetchUserUUID = async () => {
      const uuid = await GetUserUUID();
      setUserUUID(uuid);
    };

    fetchUserUUID();
  }, []);

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    const currentPageParam = Number(searchParams.get('page')) || 1;

    if (search !== currentSearch || currentPage !== currentPageParam) {
      setSearch(currentSearch);
      setCurrentPage(currentPageParam);
    }
  }, [searchParams, search, currentPage, setSearch, setCurrentPage]);

  const fetchCharactersData = useCallback(async () => {
    if (!userUUID) return;

    setLoading(true);
    try {
      const { characters, total } = await fetchCharacters(
        currentPage,
        itemsPerPage,
        search
      );
      setCharacters(characters);
      setTotal(total);
    } catch (error) {
      toast.error(t('errors.fetchingCharacters'));
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    search,
    itemsPerPage,
    userUUID,
    setCharacters,
    setTotal,
    setLoading,
    t,
  ]);

  useEffect(() => {
    fetchCharactersData();
  }, [fetchCharactersData]);

  useEffect(() => {
    navigate(`?page=${currentPage}&search=${encodeURIComponent(search)}`, {
      replace: true,
    });
  }, [currentPage, search, navigate]);

  const handleButtonClick = async (
    functionName: string,
    type: string,
    maxCharacter: number,
    page: number
  ) => {
    setLoading(true);
    setCharacters([]);

    try {
      let rawCharacters: any[] = [];
      switch (functionName) {
        case 'GetHotCharacters':
          rawCharacters = await GetHotCharacters(type, maxCharacter, page);
          break;
        case 'GetLatestCharacters':
          rawCharacters = await GetLatestCharacters(type, maxCharacter, page);
          break;
        case 'GetRandomCharacters':
          rawCharacters = await GetRandomCharacters(type, maxCharacter, page);
          break;
        case 'GetCharactersWithTags':
          rawCharacters = await GetCharactersWithTags(
            maxCharacter,
            page,
            type,
            search
          );
          break;
        default:
          throw new Error('Invalid function name');
      }

      const characters: Character[] = rawCharacters.map((char) => ({
        id: char.id,
        input_char_uuid: char.input_char_uuid,
        name: char.name,
        description: char.description,
        creator: char.creator,
        chat_messages_count: char.chat_messages_count,
        image_url: char.image_url,
        tags: char.tags,
        profile_image: char.profile_image,
        is_public: char.is_public,
        token_total: char.token_total,
      }));

      setCharacters(characters);
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
    <motion.section
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
        <nav
          className="hidden md:flex md:pl-[50px]"
          aria-label={t('ariaLabels.mainNavigation')}
        >
          <Sidebar />
        </nav>

        <main className="p-6 flex-1 flex flex-col items-center">
          <header className="w-full mb-6">
            <Banner />
          </header>

          <section
            aria-labelledby="search-heading"
            className="mb-6 w-full max-w-lg"
          >
            <h2 id="search-heading" className="sr-only">
              {t('ariaLabels.searchCharacters')}
            </h2>
            <SearchBar
              search={search}
              setSearch={setSearch}
              setCurrentPage={setCurrentPage}
              aria-label={t('ariaLabels.searchCharacters')}
            />
          </section>

          <section aria-labelledby="custom-action-heading" className="mb-6">
            <h2 id="custom-action-heading" className="sr-only">
              {t('ariaLabels.customActionButton')}
            </h2>
            <CustomButton
              onButtonClick={handleButtonClick}
              aria-label={t('ariaLabels.customActionButton')}
            />
          </section>

          <section
            aria-labelledby="characters-heading"
            className="mx-auto w-full"
          >
            <h2 id="characters-heading" className="sr-only">
              {t('ariaLabels.characterList')}
            </h2>

            <motion.div
              className="grid w-full gap-x-6 gap-y-4 pb-4 min-h-[50vh]
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <motion.article
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                      aria-label={t('ariaLabels.loadingCharacter', {
                        index: i + 1,
                      })}
                    >
                      <SkeletonCard key={i} />
                    </motion.article>
                  ))
                ) : characters.length > 0 ? (
                  characters.map((char: Character) => (
                    <motion.article
                      key={char.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="transition-transform hover:scale-105 p-2"
                      aria-labelledby={`character-${char.name}`}
                    >
                      <MemoizedCharacterCard
                        {...transformCharacter(char)}
                        isLoading={loading}
                      />
                    </motion.article>
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
          </section>

          <section aria-labelledby="pagination-heading" className="mt-6">
            <h2 id="pagination-heading" className="sr-only">
              {t('ariaLabels.paginationControls')}
            </h2>
            <LoadMore
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              user_uuid={userUUID || ''}
              onLoadMore={setCurrentPage}
            />
          </section>
        </main>
      </Container>

      <nav
        className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around p-2 shadow-lg z-50 md:hidden"
        aria-label={t('ariaLabels.mobileNavigation')}
      >
        <Sidebar />
      </nav>

      <footer className="pb-16 px-4" role="contentinfo">
        <Footer />
        <Typography variant="body2" className="text-center text-gray-500 mt-4">
          © 2025 Pyrenz AI. {t('messages.allRightsReserved')}
        </Typography>
      </footer>

      <ToastContainer />
    </motion.section>
  );
}
