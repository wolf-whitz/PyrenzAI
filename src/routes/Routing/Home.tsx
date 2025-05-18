import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@mui/material';
import { CustomButton, Pagination, Banner } from '@ui';
import {
  Sidebar,
  SearchBar,
  Footer,
  PreviewHeader,
  CharacterList,
} from '@layout';
import { useHomepageAPI } from '@api';

export function Home() {
  const {
    navigate,
    search,
    currentPage,
    characters,
    loading,
    bgImage,
    setSearch,
    setCurrentPage,
    t,
    userUUID,
    itemsPerPage,
    totalPages,
    handleButtonClick,
    transformCharacter,
    fetchUserData,
  } = useHomepageAPI();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    navigate(`?page=${currentPage}&search=${encodeURIComponent(search)}`, {
      replace: true,
    });
  }, [currentPage, search, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <motion.section
      className="flex flex-col min-h-screen text-white font-baloo"
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
      <div className="w-full">
        <PreviewHeader
          setShowLogin={setShowLogin}
          setShowRegister={setShowRegister}
        />
      </div>

      <Container
        maxWidth={false}
        disableGutters
        className="flex flex-1 flex-col md:flex-row"
      >
        <nav
          className="hidden md:flex md:pl-[50px] mt-16"
          aria-label={t('ariaLabels.mainNavigation')}
        >
          <Sidebar />
        </nav>

        <main className="p-6 flex-1 flex flex-col items-center">
          <header className="w-full">
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
              characters={characters.map(transformCharacter)}
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

      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around p-2 shadow-lg z-40 md:hidden">
        <Sidebar />
      </nav>

      <footer className="px-4" role="contentinfo">
        <Footer />
      </footer>
    </motion.section>
  );
}
