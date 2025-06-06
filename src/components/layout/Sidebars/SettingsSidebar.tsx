import { Box } from '@mui/material';
import { Persona } from '@components';
import { PyrenzStyledDrawer } from '~/theme';

interface SettingsSidebarProps {
  settingsOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    user_avatar: string;
  };
}

export function SettingsSidebar({
  settingsOpen,
  onClose,
  user,
}: SettingsSidebarProps) {
  return (
    <PyrenzStyledDrawer
      isOpen={settingsOpen}
      onClose={onClose}
      profileData={{
        name: user.username,
        avatarUrl: user.user_avatar,
      }}
    >
      <Box className="flex justify-center">
        <img
          src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Support.avif"
          alt="Support Us"
          className="rounded-lg max-w-full h-auto select-none pointer-events-none shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-hover"
        />
      </Box>

      <Box className="flex justify-center mt-4">
        <Persona />
      </Box>
    </PyrenzStyledDrawer>
  );
}
