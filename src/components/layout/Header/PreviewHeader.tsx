import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  HomeOutlined as HomeIcon,
  ChatOutlined as ChatIcon,
  Menu as MenuIcon,
  AutoAwesome as PyrenzPlusIcon,
  LoginOutlined as LoginIcon,
  PersonAddOutlined as PersonAddIcon,
  DescriptionOutlined as DescriptionIcon,
} from '@mui/icons-material';
import { FaDiscord } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Utils } from '~/Utility';
import { PyrenzBlueButtonWithLoading, PyrenzMenu } from '~/theme';
import { useUserStore } from '~/store';

interface HeaderProps {
  setShowLogin: (value: boolean) => void;
  setShowRegister: (value: boolean) => void;
}

export function PreviewHeader({ setShowLogin, setShowRegister }: HeaderProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMediumOrSmaller = useMediaQuery(theme.breakpoints.down('md'));

  const subscriptionPlan = useUserStore((state) => state.subscription_plan);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data, error } = await Utils.db.client.auth.getSession();
        if (data?.session) {
          setIsLoggedIn(true);
        }
        if (error) {
          console.error(error);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkUserSession();
  }, []);

  const menuItems = [
    { name: t('navigation.home'), icon: <HomeIcon />, link: '/Home' },
    { name: t('navigation.chats'), icon: <ChatIcon />, link: '/Archive' },
    { name: 'Documentation', icon: <DescriptionIcon />, link: '/docs' },
    {
      name: t('footer.links.discord'),
      icon: <FaDiscord />,
      link: 'https://discord.gg/zTcyP4WB8h',
      external: true,
    },
  ];

  if (subscriptionPlan?.includes('Melon')) {
    menuItems.push({
      name: 'Pyrenz+',
      icon: <PyrenzPlusIcon />,
      link: '/Subscription',
    });
  }

  const authButtons = [
    {
      name: t('buttons.login'),
      icon: <LoginIcon />,
      action: () => setShowLogin(true),
    },
    {
      name: t('buttons.signUp'),
      icon: <PersonAddIcon />,
      action: () => setShowRegister(true),
    },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: 'rgba(18, 18, 18, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 6 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              ml: { md: 7.5 },
            }}
            onClick={() => navigate('/')}
          >
            <motion.img
              src="/favicon.png"
              alt={t('footer.pyrenzLogo')}
              style={{ width: 32, height: 32 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.6rem',
                  transition: 'color 0.3s',
                  '&:hover': { color: 'white' },
                }}
              >
                Pyrenz
              </Typography>
              <Typography
                component="h5"
                sx={{
                  color: '#add8e6',
                  fontWeight: 'bold',
                  fontSize: '1.6rem',
                }}
              >
                AI
              </Typography>
            </Box>
          </Box>

          {!isMediumOrSmaller && (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
              {menuItems.map(({ name, icon, link, external }) => (
                <PyrenzBlueButtonWithLoading
                  key={name}
                  startIcon={icon}
                  sx={{
                    color: 'white',
                    background: 'transparent',
                    border: 'none',
                    typography: 'body1',
                    '&:hover': { color: 'white' },
                  }}
                  onClick={() =>
                    external ? window.open(link, '_blank') : navigate(link)
                  }
                >
                  {name}
                </PyrenzBlueButtonWithLoading>
              ))}
              {!isLoggedIn && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {authButtons.map(({ name, icon, action }) => (
                    <PyrenzBlueButtonWithLoading
                      key={name}
                      startIcon={icon}
                      sx={{
                        color: 'white',
                        background: 'transparent',
                        border: 'none',
                        typography: 'body1',
                        '&:hover': { color: 'white' },
                      }}
                      onClick={action}
                    >
                      {name}
                    </PyrenzBlueButtonWithLoading>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {isMediumOrSmaller && (
            <Box>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MenuIcon />
              </IconButton>
              <PyrenzMenu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                {menuItems.map(({ name, icon, link, external }) => (
                  <MenuItem
                    key={name}
                    onClick={() => {
                      setMenuAnchor(null);
                      external ? window.open(link, '_blank') : navigate(link);
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {icon}
                      <Typography variant="body1">{name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
                {!isLoggedIn &&
                  authButtons.map(({ name, icon, action }) => (
                    <MenuItem
                      key={name}
                      onClick={() => {
                        setMenuAnchor(null);
                        action();
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {icon}
                        <Typography variant="body1">{name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
              </PyrenzMenu>
            </Box>
          )}
        </Toolbar>
      </motion.div>
    </AppBar>
  );
}
