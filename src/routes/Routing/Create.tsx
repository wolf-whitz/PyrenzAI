import React, { useState, useEffect, Suspense } from 'react';
import { CharacterForm, Sidebar, CommunityGuidelines, MobileNav, GetUserUUID, CreatePageLoader } from '@components';
import { useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { useParams } from 'react-router-dom';
import { CharacterData } from '@shared-types/CharacterProp';

export function CreatePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [characterData, setCharacterData] = useState<CharacterData | undefined>(undefined);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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
          setIsDataLoaded(true);
        } else {
          setCharacterData(data);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching user UUID or character data:', error);
        setIsDataLoaded(true);
      }
    };

    fetchCharacterData();
  }, [uuid]);

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
          <CharacterForm characterData={characterData} isDataLoaded={isDataLoaded} />
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
