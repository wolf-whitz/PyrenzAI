import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  HomeOutlined as HomeIcon,
  AddOutlined as PlusIcon,
  ChatOutlined as MessageSquareIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '~/store';

type SetShowLoginModal = (show: boolean) => void;

export function MobileNav({ setShowLoginModal }: { setShowLoginModal: SetShowLoginModal }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLogin = useUserStore((state) => state.is_login);

  const menuItems = [
    {
      name: t('navigation.home'),
      icon: <HomeIcon fontSize="small" />,
      path: '/Home',
    },
    {
      name: t('navigation.create'),
      icon: <PlusIcon fontSize="small" />,
      path: '/Create',
    },
    {
      name: t('navigation.chats'),
      icon: <MessageSquareIcon fontSize="small" />,
      path: '/Archive',
    },
    {
      name: t('navigation.settings'),
      icon: <SettingsIcon fontSize="small" />,
      path: '/Settings',
    },
  ];

  const handleNavigation = (item: { name: string; path: string }) => {
    if (
      [
        t('navigation.settings'),
        t('navigation.create'),
        t('navigation.chats'),
      ].includes(item.name) &&
      !isLogin
    ) {
      setShowLoginModal(true);
    } else {
      navigate(item.path);
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }} elevation={3}>
      <BottomNavigation showLabels>
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.name}
            label={item.name}
            icon={item.icon}
            onClick={() => handleNavigation(item)}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
