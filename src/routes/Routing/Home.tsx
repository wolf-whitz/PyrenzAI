import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Container, useMediaQuery, Box, useTheme } from '@mui/material';
import {
  Sidebar,
  SearchBar,
  Footer,
  PreviewHeader,
  CharacterList,
  MobileNav,
  CustomButton,
  Pagination,
  Banner
} from '@components';
import { useHomepageAPI } from '@api';

export function Home() {
  const {
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchData = useCallback(() => {
    fetchUserData().catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, [fetchUserData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
        <Box sx={{ width: '100%' }}>
          <PreviewHeader
            setShowLogin={setShowLogin}
            setShowRegister={setShowRegister}
          />
        </Box>

        <Container
          maxWidth={false}
          disableGutters
          className="flex flex-1 flex-col md:flex-row"
        >
          {!isMobile && (
            <Box
              component="nav"
              sx={{
                display: { xs: 'none', md: 'flex' },
                pl: '50px',
                mt: '16px',
              }}
              aria-label={t('ariaLabels.mainNavigation')}
            >
              <Sidebar />
            </Box>
          )}

          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
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
          </Box>
        </Container>

        {isMobile && <MobileNav setShowLoginModal={setShowLogin} />}

        <footer className="px-4" role="contentinfo">
          <Footer />
        </footer>
      </motion.section>
    </Box>
  );
}
