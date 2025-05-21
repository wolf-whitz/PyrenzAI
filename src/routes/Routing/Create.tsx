import React, { useState } from 'react';
import { CharacterForm, Sidebar, CommunityGuidelines, MobileNav } from '@components';
import { useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';

export function CreatePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
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
  );
}
