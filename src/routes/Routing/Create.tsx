import React, { useState, useEffect, Suspense } from 'react';
import {
  CharacterForm,
  Sidebar,
  CommunityGuidelines,
  MobileNav,
  CreatePageLoader,
  GetUserUUID,
} from '@components';
import { GetUserData } from '@function';
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { Utils } from '~/Utility';
import { useParams } from 'react-router-dom';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import { User } from '@supabase/supabase-js';

export function CreatePage() {
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
    async function init() {
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
          const { data: publicData } = await Utils.db.select<Character>({
            tables: 'public_characters',
            columns: '*',
            match: { char_uuid },
          });

          let character = publicData?.[0] ?? null;

          if (!character) {
            const { data: privateData } = await Utils.db.select<Character>({
              tables: 'private_characters',
              columns: '*',
              match: { char_uuid, creator_uuid: fetchedUUID },
            });
            character = privateData?.[0] ?? null;
          }

          if (character) {
            if (character.tags && !Array.isArray(character.tags)) {
              character.tags = (character.tags as string)
                .split(',')
                .map((tag) => tag.trim());
            }

            setCharacter({
              ...character,
              emotions:
                character.emotions?.map((e) => ({
                  triggerWords: e.triggerWords ?? [],
                  imageUrl: e.imageUrl ?? null,
                  file: null,
                })) ?? [],
            });

            setCharacterUpdate(true);
          }
        } catch (e) {
          console.error('Error loading character:', e);
        }
      }

      setIsDataLoaded(true);
    }

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
        <Box component="aside" flexShrink={0} zIndex={2}>
          <Sidebar />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!user ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography variant="h4">Please Log In</Typography>
            </Box>
          ) : !userUUID ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography variant="h5" color="error">
                Error: Unable to get user_uuid
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                position="relative"
                width="100%"
                height="100%"
                overflow="hidden"
              >
                <CharacterForm
                  character_update={characterUpdate}
                  user_uuid={userUUID}
                  creator={creatorName}
                />
              </Box>

              <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2, px: 2 }}>
                <CommunityGuidelines />
              </Box>
            </>
          )}
        </Box>

        <Box
          component="aside"
          sx={{
            display: { xs: 'none', sm: 'block' },
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <CommunityGuidelines />
        </Box>

        {isMobile && <MobileNav setShowLoginModal={() => {}} />}
      </Box>
    </Suspense>
  );
}
