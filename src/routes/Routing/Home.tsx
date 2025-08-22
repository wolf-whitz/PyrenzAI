import { useState } from 'react';
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
  Banner,
  AuthenticationModal,
  useHomepageAPI,
} from '@components';
import { useSearchParams } from 'react-router-dom';

export function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1'));

  const {
    search,
    characters,
    loading,
    setSearch,
    totalPages,
    t,
    itemsPerPage,
    handleCharacterFetchClick,
    onButtonTagClicked,
    setCurrentPage,
  } = useHomepageAPI(currentPage);

  const setPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    setCurrentPage(page);
  };

  const toggleMode = () => {
    setShowLogin(!showLogin);
    setShowRegister(!showRegister);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <motion.div
        className="flex flex-col min-h-screen text-white"
        aria-label={t('ariaLabels.homePage')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PreviewHeader
          setShowLogin={setShowLogin}
          setShowRegister={setShowRegister}
        />

        <Container
          maxWidth={false}
          disableGutters
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
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
            <Box sx={{ width: '100%' }}>
              <Banner />
            </Box>

            <Box sx={{ mb: 6, width: '100%', maxWidth: 'lg' }}>
              <h2 id="search-heading" className="sr-only">
                {t('ariaLabels.searchCharacters')}
              </h2>
              <SearchBar
                search={search}
                setSearch={handleSearchChange}
                setCurrentPage={setPage}
                aria-label={t('ariaLabels.searchCharacters')}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <h2 id="custom-action-heading" className="sr-only">
                {t('ariaLabels.customActionButton')}
              </h2>
              <CustomButton
                onButtonClick={handleCharacterFetchClick}
                onButtonTagClicked={onButtonTagClicked}
                aria-label={t('ariaLabels.customActionButton')}
              />
            </Box>

            <Box sx={{ width: '100%' }}>
              <h2 id="characters-heading" className="sr-only">
                {t('ariaLabels.characterList')}
              </h2>
              <CharacterList
                characters={characters}
                loading={loading}
                itemsPerPage={itemsPerPage}
                t={t}
              />
            </Box>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onNext={() => setPage(currentPage + 1)}
              onPrev={() => setPage(currentPage - 1)}
            />
          </Box>
        </Container>

        {isMobile && <MobileNav setShowLoginModal={setShowLogin} />}

        <Box component="footer" sx={{ px: 4 }} role="contentinfo">
          <Footer />
        </Box>
      </motion.div>

      {(showLogin || showRegister) && (
        <AuthenticationModal
          mode={showLogin ? 'login' : 'register'}
          onClose={() => {
            setShowLogin(false);
            setShowRegister(false);
          }}
          toggleMode={toggleMode}
        />
      )}
    </Box>
  );
}
