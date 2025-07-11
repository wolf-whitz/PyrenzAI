import React, { useState, useEffect, Suspense } from 'react';
import {
  CharacterForm,
  Sidebar,
  CommunityGuidelines,
  MobileNav,
  CreatePageLoader,
} from '@components';
import {   GetUserData  } from '@function'
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { supabase } from '@utils';
import { useParams } from 'react-router-dom';
import { useCharacterStore, useUserStore } from '~/store';
import { Character } from '@shared-types';
import { User } from '@supabase/supabase-js';

export function CreatePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [characterUpdate, setCharacterUpdate] = useState(false);
  const [creatorName, setCreatorName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const user_uuid = useUserStore((state) => state.userUUID);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { char_uuid } = useParams();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const fetchData = async () => {
      const userData = await GetUserData();
      if ('username' in userData) {
        setCreatorName(userData.username);
      } else {
        console.error('Error fetching user data:', userData.error);
      }

      if (char_uuid) {
        try {
          let { data, error } = await supabase
            .from('public_characters')
            .select('*')
            .eq('char_uuid', char_uuid)
            .single();

          if (error) {
            const privateResponse = await supabase
              .from('private_characters')
              .select('*')
              .eq('char_uuid', char_uuid)
              .eq('creator_uuid', user_uuid)
              .single();

            if (privateResponse.error) {
              console.error(
                'Error fetching character data:',
                privateResponse.error
              );
            } else if (privateResponse.data) {
              data = privateResponse.data;
            }
          }

          if (data) {
            if (data.tags && !Array.isArray(data.tags)) {
              data.tags = data.tags.split(',').map((tag: string) => tag.trim());
            }

            setCharacter(data as Character);
            setCharacterUpdate(true);
          }
        } catch (error) {
          console.error('Error fetching character data:', error);
        }
      }

      setIsDataLoaded(true);
    };

    if (!user_uuid) {
      console.error('User UUID not found');
      setIsDataLoaded(true);
      return;
    }

    fetchData();
  }, [char_uuid, setCharacter, user_uuid]);

  if (!isDataLoaded) {
    return <CreatePageLoader />;
  }

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
                  user_uuid={user_uuid}
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
