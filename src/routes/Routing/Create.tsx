import React, { useState, useEffect, Suspense } from 'react';
import {
  CharacterForm,
  Sidebar,
  CommunityGuidelines,
  MobileNav,
  CreatePageLoader,
  GetUserData,
} from '@components';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { useParams } from 'react-router-dom';
import { useCharacterStore, useUserStore } from '~/store';
import { Character } from '@shared-types';

export function CreatePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [characterUpdate, setCharacterUpdate] = useState(false);
  const [creatorName, setCreatorName] = useState<string | null>(null);

  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const user_uuid = useUserStore((state) => state.userUUID);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { char_uuid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await GetUserData();
      if ('username' in userData) {
        setCreatorName(userData.username);
      } else {
        console.error('Error fetching user data:', userData.error);
      }

      if (char_uuid) {
        try {
          const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('char_uuid', char_uuid)
            .eq('creator_uuid', user_uuid)
            .single();

          if (error) {
            console.error('Error fetching character data:', error);
          } else if (data) {
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
        <Box width={{ xs: '100%', sm: '256px' }}>
          <Sidebar />
        </Box>

        <Box flex={1}>
          <CharacterForm
            character_update={characterUpdate}
            user_uuid={user_uuid}
            creator={creatorName}
          />
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
            <CommunityGuidelines />
          </Box>
        </Box>

        <Box
          sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: '256px' } }}
        >
          <CommunityGuidelines />
        </Box>

        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
      </Box>
    </Suspense>
  );
}
