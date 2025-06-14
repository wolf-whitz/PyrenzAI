import { GetUserUUID } from '@components';
import { useParams } from 'react-router-dom';
import {
  Sidebar,
  CharacterCard,
  UserProfileHeader,
  GetUserCreatedCharacters,
  MobileNav,
} from '@components';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Character } from '@shared-types';
import { useEffect, useState } from 'react';

export function ProfilePage() {
  const { user_uuid } = useParams();
  const [safeUserUuid, setSafeUserUuid] = useState<string | undefined>(user_uuid);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUserUUID = async () => {
      if (!user_uuid || user_uuid.trim() === '') {
        try {
          const userUUID = await GetUserUUID();
          setSafeUserUuid(userUUID ?? undefined);
        } catch (error) {
          console.error('Error fetching user UUID:', error);
          setSafeUserUuid(undefined);
        }
      }
    };

    fetchUserUUID();
  }, [user_uuid]);

  const { characters, userData, loading } = GetUserCreatedCharacters(safeUserUuid);

  const isUserDataValid = userData && userData.avatar_url && userData.username && userData.user_uuid;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box display="flex" flex={1}>
        <Sidebar className="flex-shrink-0" />
        <Box flex={1} overflow="auto">
          {loading || !isUserDataValid ? (
            <UserProfileHeader loading={true} userData={{ username: '', avatar_url: '', user_uuid: '' }} />
          ) : (
            <>
              <UserProfileHeader loading={false} userData={userData} />
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
                pl={{ md: 15 }}
              >
                {characters.length > 0 ? (
                  characters.map((character: Character) => {
                    const isOwner = character.creator_uuid === safeUserUuid;
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
            </>
          )}
          {!loading && !userData && (
            <Typography
              variant="h6"
              sx={{ gridColumn: '1 / -1', textAlign: 'center' }}
            >
              This user does not exist (·•᷄‎ࡇ•᷅ )
            </Typography>
          )}
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
    </Box>
  );
}
