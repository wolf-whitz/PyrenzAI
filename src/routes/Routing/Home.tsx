import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  useMediaQuery,
  Box,
  useTheme,
} from '@mui/material';
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
} from '@components';
import { useHomepageAPI } from '@api';
import { supabase } from '~/Utility/supabaseClient';
import { User } from '@supabase/supabase-js';

export function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const {
    search,
    currentPage,
    characters,
    loading,
    setSearch,
    setCurrentPage,
    t,
    itemsPerPage,
    handleButtonClick,
    fetchUserData,
  } = useHomepageAPI(user);

  const fetchData = useCallback(() => {
    if (user) {
      fetchUserData().catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [fetchUserData, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleMode = () => {
    setShowLogin(!showLogin);
    setShowRegister(!showRegister);
  };

  return (
    <Box
      component="div"
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <motion.div
        className="flex flex-col min-h-screen text-white font-baloo"
        aria-label={t('ariaLabels.homePage')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box component="header" sx={{ width: '100%' }}>
          <PreviewHeader
            setShowLogin={setShowLogin}
            setShowRegister={setShowRegister}
          />
        </Box>

        <Container
          component="div"
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
            <Box component="header" sx={{ width: '100%' }}>
              <Banner />
            </Box>

            <Box
              component="div"
              sx={{ mb: 6, width: '100%', maxWidth: 'lg' }}
              aria-labelledby="search-heading"
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
            </Box>

            <Box
              component="div"
              sx={{ mb: 6 }}
              aria-labelledby="custom-action-heading"
            >
              <h2 id="custom-action-heading" className="sr-only">
                {t('ariaLabels.customActionButton')}
              </h2>
              <CustomButton
                onButtonClick={handleButtonClick}
                aria-label={t('ariaLabels.customActionButton')}
              />
            </Box>

            <Box
              component="div"
              sx={{ width: '100%' }}
              aria-labelledby="characters-heading"
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
            </Box>

            {!loading && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                search={search}
              />
            )}
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
