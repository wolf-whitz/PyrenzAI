import { useParams } from 'react-router-dom';
import {
  Sidebar,
  CharacterCard,
  UserProfileHeader,
  MobileNav,
} from '@components';
import { getUserCreatedCharacters as GetUserCreatedCharacters } from '@function';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Character, User } from '@shared-types';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface UserCharactersResult {
  characters: Character[];
  userData: any;
  loading: boolean;
  isOwner: boolean;
  maxPage: number;
}

export function ProfilePage() {
  const { creator_uuid } = useParams<{ creator_uuid: string }>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshCharacters, setRefreshCharacters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const itemsPerPage = 20;

  const result: UserCharactersResult = GetUserCreatedCharacters(
    creator_uuid,
    page,
    itemsPerPage,
    refreshCharacters
  ) ?? {
    characters: [],
    userData: null,
    loading: false,
    isOwner: false,
    maxPage: 1,
  };

  const { characters = [], userData, loading, isOwner, maxPage = 1 } = result;

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };

  const handleCharacterDeleted = () => {
    setRefreshCharacters((prev) => !prev);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex" flex={1}>
          <Sidebar className="flex-shrink-0" />
          <Box
            flex={1}
            overflow="auto"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        </Box>
        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex" flex={1}>
          <Sidebar className="flex-shrink-0" />
          <Box
            flex={1}
            overflow="auto"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography variant="h6">
              This user does not exist (·•᷄‎ࡇ•᷅ )
            </Typography>
          </Box>
        </Box>
        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box display="flex" flex={1}>
        <Sidebar className="flex-shrink-0" />
        <Box flex={1} overflow="auto">
          <UserProfileHeader user={userData} />
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
            {characters && characters[0] ? (
              characters.map((character) => (
                <Box key={character.id}>
                  <CharacterCard
                    character={character}
                    isOwner={isOwner}
                    onCharacterDeleted={handleCharacterDeleted}
                  />
                </Box>
              ))
            ) : (
              <Typography
                variant="h6"
                sx={{ gridColumn: '1 / -1', textAlign: 'center' }}
              >
                This user has not created any characters yet. (๑-﹏-๑)
              </Typography>
            )}
          </Box>
          {characters && characters[0] && maxPage > 1 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <IconButton onClick={handlePreviousPage} disabled={page === 1}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Page {page} of {maxPage}
              </Typography>
              <IconButton onClick={handleNextPage} disabled={page === maxPage}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
    </Box>
  );
}
