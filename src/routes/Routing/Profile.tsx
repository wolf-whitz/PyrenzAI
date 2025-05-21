import { GetUserUUID } from '@components';
import { useParams } from 'react-router-dom';
import {
  Sidebar,
  SkeletonCard,
  CharacterCard,
  UserProfileHeader,
  GetUserCreatedCharacters,
  MobileNav
} from '@components';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Character } from '@shared-types/CharacterProp';
import { useEffect, useState } from 'react';

export function ProfilePage() {
  const { uuid } = useParams();
  const [safeUuid, setSafeUuid] = useState<string | undefined>(undefined);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUserUUID = async () => {
      if (!uuid || uuid.trim() === '') {
        try {
          const userUUID = await GetUserUUID();
          setSafeUuid(userUUID ?? undefined);
        } catch (error) {
          console.error('Error fetching user UUID:', error);
          setSafeUuid(undefined);
        }
      } else {
        setSafeUuid(uuid);
      }
    };

    fetchUserUUID();
  }, [uuid]);

  const { characters, userData, loading } = GetUserCreatedCharacters(safeUuid);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box display="flex" flex={1}>
        <Sidebar className="flex-shrink-0" />
        <Box flex={1} p={4} overflow="auto">
          <UserProfileHeader loading={loading} userData={userData} />
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)',
              xxl: 'repeat(6, 1fr)'
            }}
            gap={6}
            pb={4}
            minHeight="50vh"
            pl={{ md: 20 }}
          >
            {loading ? (
              Array.from(new Array(6)).map((_, index) => (
                <Box key={index}>
                  <SkeletonCard />
                </Box>
              ))
            ) : !userData ? (
              <Typography
                variant="h6"
                sx={{ gridColumn: '1 / -1', textAlign: 'center' }}
              >
                This user does not exist (·•᷄‎ࡇ•᷅ )
              </Typography>
            ) : characters.length > 0 ? (
              characters.map((character: Character) => {
                const isOwner = character.creator_uuid === safeUuid;
                console.log('isOwner', isOwner);
                return (
                  <Box key={character.id}>
                    <CharacterCard character={character} isOwner={isOwner} />
                  </Box>
                );
              })
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
