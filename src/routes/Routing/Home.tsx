import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from '~/store';
import { motion } from 'framer-motion';
import { Character } from '@shared-types/CharacterProp';
import { Box, Typography, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import {
  GetHotCharacters,
  GetLatestCharacters,
  GetRandomCharacters,
  GetCharactersWithTags,
} from '~/functions';
import {
  Sidebar,
  Banner,
  SearchBar,
  Footer,
  CustomButton,
  useFetchUserUUID,
  useSyncSearchParams,
  useFetchCharacters,
  CharacterList,
  Pagination
} from '~/components';

export default function Home() {
  const navigate = useNavigate();
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
  const userUUID = useFetchUserUUID();
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useSyncSearchParams({ search, currentPage, setSearch, setCurrentPage });

  useFetchCharacters({
    currentPage,
    search,
    itemsPerPage,
    userUUID,
    setCharacters,
    setTotal,
    setLoading,
    t,
  });

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
            <CharacterList
              characters={characters}
              loading={loading}
              itemsPerPage={itemsPerPage}
              t={t}
            />
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            userUUID={userUUID}
            setCurrentPage={setCurrentPage}
            t={t}
          />
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
