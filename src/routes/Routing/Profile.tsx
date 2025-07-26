import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Sidebar,
  CharacterCard,
  UserProfileHeader,
  MobileNav,
  CustomButton,
  Pagination,
} from '@components';
import { getUserCreatedCharacters as useUserCreatedCharacters } from '@function';
import { GetUserUUID } from '~/components';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';

export function ProfilePage() {
  const urlParams = useParams<{ creator_uuid?: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [creatorUUID, setCreatorUUID] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    characters,
    userData,
    loading,
    maxPage,
    currentPage,
    handleButtonClick,
    handleButtonTagClicked,
    goToNextPage,
    goToPrevPage,
  } = useUserCreatedCharacters(creatorUUID, 20);

  useEffect(() => {
    const fetchUUID = async () => {
      if (!urlParams.creator_uuid) {
        const result = await GetUserUUID();
        setCreatorUUID(result ?? null);
      } else {
        setCreatorUUID(urlParams.creator_uuid);
      }
    };

    fetchUUID();
  }, [urlParams.creator_uuid]);

  useEffect(() => {
    if (creatorUUID) {
      handleButtonClick('hot', 20, currentPage);
    }
  }, [creatorUUID, currentPage]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box display="flex" flex={1}>
        <Sidebar className="flex-shrink-0" />
        <Box flex={1} overflow="auto">
          {loading? (
            <Box display="flex" justifyContent="center" pt={10}>
              <CircularProgress />
            </Box>
          ) : !userData ? (
            <Box display="flex" justifyContent="center" pt={10}>
              <Typography>This user does not exist (¬_¬ )</Typography>
            </Box>
          ) : (
            <>
              <UserProfileHeader user={userData} />

              <Box px={3} pt={2}>
                <CustomButton
                  onButtonClick={async (type, page, options) => {
                    await handleButtonClick(
                      type,
                      20,
                      page,
                      options?.tag,
                      options?.gender,
                      options?.searchQuery
                    );
                  }}
                  onButtonTagClicked={handleButtonTagClicked}
                />
              </Box>

              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)',
                  xxl: 'repeat(6, 1fr)',
                }}
                gap={2}
                pb={4}
                minHeight="50vh"
                pl={{ md: 10 }}
              >
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    gridColumn="1 / -1"
                    pt={4}
                  >
                    <CircularProgress />
                  </Box>
                ) : characters.length > 0 ? (
                  characters.map((char) => (
                    <CharacterCard key={char.id} character={char} />
                  ))
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ gridColumn: '1 / -1', textAlign: 'center' }}
                  >
                    This user hasn’t created anything yet or that character doesn't exist. 💤
                  </Typography>
                )}
              </Box>

              <Pagination
                totalPages={maxPage}
                currentPage={currentPage}
                isLoading={loading}
                onNext={goToNextPage}
                onPrev={goToPrevPage}
              />
            </>
          )}
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
    </Box>
  );
}
