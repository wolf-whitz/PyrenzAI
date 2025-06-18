import { useParams } from 'react-router-dom';
import {
  Sidebar,
  CharacterCard,
  UserProfileHeader,
  GetUserCreatedCharacters,
  MobileNav,
} from '@components';
import { Box, Typography, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { useState } from 'react';

export function ProfilePage() {
  const { creator_uuid } = useParams<{ creator_uuid: string }>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { characters, userData, loading, isOwner } = GetUserCreatedCharacters(creator_uuid);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex" flex={1}>
          <Sidebar className="flex-shrink-0" />
          <Box flex={1} overflow="auto" display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
          <Box flex={1} overflow="auto" display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography variant="h6">This user does not exist (·•᷄‎ࡇ•᷅ )</Typography>
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
            {characters.length > 0 ? (
              characters.map((character) => (
                <Box key={character.id}>
                  <CharacterCard character={character} isOwner={isOwner} />
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
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
    </Box>
  );
}
