import React, { useState, useEffect, Suspense } from 'react';
import {
  CharacterForm,
  Sidebar,
  CommunityGuidelines,
  MobileNav,
  CreatePageLoader,
  GetUserUUID
} from '@components';
import { GetUserData } from '@function';
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { Utils } from '~/Utility';
import { useParams } from 'react-router-dom';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import { User } from '@supabase/supabase-js';

export function CreatePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [characterUpdate, setCharacterUpdate] = useState(false);
  const [creatorName, setCreatorName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userUUID, setUserUUID] = useState<string | null>(null);

  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { char_uuid } = useParams();

  useEffect(() => {
    const init = async () => {
      const fetchedUUID = await GetUserUUID();
      setUserUUID(fetchedUUID);

      const userResult = await Utils.db.client.auth.getUser();
      setUser(userResult.data.user ?? null);

      const userData = await GetUserData();
      if ('username' in userData) {
        setCreatorName(userData.username);
      }

      if (!fetchedUUID) {
        setIsDataLoaded(true);
        return;
      }

      if (char_uuid) {
        try {
          const { data: publicData } = await Utils.db.select<Character>(
            'public_characters',
            '*',
            null,
            { char_uuid }
          );

          let character: Character | null = publicData?.[0] ?? null;

          if (!character) {
            const { data: privateData } = await Utils.db.select<Character>(
              'private_characters',
              '*',
              null,
              { char_uuid, creator_uuid: fetchedUUID }
            );

            character = privateData?.[0] ?? null;
          }

          if (character) {
            if (character.tags && !Array.isArray(character.tags)) {
              character.tags = (character.tags as string)
                .split(',')
                .map((tag) => tag.trim());
            }

            setCharacter(character);
            setCharacterUpdate(true);
          }
        } catch (e) {
          console.error('Error loading character:', e);
        }
      }

      setIsDataLoaded(true);
    };

    init();
  }, [char_uuid, setCharacter]);

  if (!isDataLoaded) return <CreatePageLoader />;

  return (
    <Suspense fallback={<CreatePageLoader />}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        width="100%"
        minHeight="100vh"
      >
        <Box component="aside" width={{ xs: '100%', sm: '256px' }}>
          <Sidebar />
        </Box>

        <Box component="main" flex={1} display="flex" flexDirection="column">
          {!user ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
            >
              <Typography variant="h4">Please Log In</Typography>
            </Box>
          ) : (
            <>
              <Box flex={1} overflow="auto">
                <CharacterForm
                  character_update={characterUpdate}
                  user_uuid={userUUID}
                  creator={creatorName}
                />
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
                <CommunityGuidelines />
              </Box>
            </>
          )}
        </Box>

        <Box
          component="aside"
          sx={{ display: { xs: 'none', sm: 'block' }, width: '256px' }}
        >
          <CommunityGuidelines />
        </Box>

        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
      </Box>
    </Suspense>
  );
}
