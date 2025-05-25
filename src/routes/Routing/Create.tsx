import React, { useState, useEffect, Suspense } from 'react';
import {
  CharacterForm,
  Sidebar,
  CommunityGuidelines,
  MobileNav,
  GetUserUUID,
  CreatePageLoader,
} from '@components';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { useParams } from 'react-router-dom';
import { useCharacterStore } from '~/store';
import { CharacterData } from '@shared-types/CharacterProp';

export function CreatePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const setCharacterData = useCharacterStore((state) => state.setCharacterData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { uuid } = useParams();

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!uuid) {
        setIsDataLoaded(true);
        return;
      }

      try {
        const creatorUuid = await GetUserUUID();

        if (!creatorUuid) {
          console.error('User UUID not found');
          setIsDataLoaded(true);
          return;
        }

        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('char_uuid', uuid)
          .eq('creator_uuid', creatorUuid)
          .single();

        if (error) {
          console.error('Error fetching character data:', error);
        } else {
          setCharacterData(data as CharacterData); 
        }
      } catch (error) {
        console.error('Error fetching user UUID or character data:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    fetchCharacterData();
  }, [uuid, setCharacterData]);

  if (!isDataLoaded) {
    return <CreatePageLoader />;
  }

  return (
    <Suspense fallback={<CreatePageLoader />}>
      <Box display="flex" flexDirection="column" width="100%" minHeight="100vh" sx={{ flexDirection: { sm: 'row' } }}>
        <Box width="100%" sx={{ width: { sm: '256px' } }}>
          <Sidebar />
        </Box>

        <Box flex={1}>
          <CharacterForm />
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
            <CommunityGuidelines />
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: '256px' } }}>
          <CommunityGuidelines />
        </Box>

        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
      </Box>
    </Suspense>
  );
}
