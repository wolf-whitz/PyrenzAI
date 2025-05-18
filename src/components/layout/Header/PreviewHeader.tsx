import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { FaDiscord } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { supabase } from '~/Utility/supabaseClient';
import { MuiStyledDrawer, MuiBlueButton } from '~/theme';

interface HeaderProps {
  setShowLogin: (value: boolean) => void;
  setShowRegister: (value: boolean) => void;
}

export function PreviewHeader({ setShowLogin, setShowRegister }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
      } else if (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, []);

  const menuItems = [
    { name: t('navigation.home'), icon: <HomeIcon />, link: '/Home' },
    {
      name: t('footer.links.explore'),
      icon: <ExploreIcon />,
      link: '/Explore',
    },
    { name: t('navigation.chats'), icon: <ChatIcon />, link: '/Chats' },
    {
      name: t('footer.links.discord'),
      icon: <FaDiscord />,
      link: 'https://discord.com',
      external: true,
    },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: 'gray.900' }}
    >
      <Toolbar className="flex justify-between items-center w-full max-w-screen-2xl mx-auto px-6">
        <div
          className="flex items-center space-x-4 cursor-pointer md:ml-[60px]"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/favicon.png"
            alt={t('footer.pyrenzLogo')}
            className="h-8 w-8"
          />
          <h1 className="text-2xl font-bold font-baloo">
            Pyrenz<span className="text-[#add8e6]">AI</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map(({ name, icon, link, external }) => (
            <MuiBlueButton
              key={name}
              startIcon={icon}
              className="font-baloo hover:text-blue-600"
              onClick={() =>
                external
                  ? window.open(link, '_blank')
                  : (window.location.href = link)
              }
              Blue={true}
            >
              {name}
            </MuiBlueButton>
          ))}
          {!isLoggedIn && (
            <>
              <MuiBlueButton
                className="font-baloo hover:text-blue-600"
                onClick={() => setShowLogin(true)}
                Blue={true}
              >
                {t('buttons.login')}
              </MuiBlueButton>
              <MuiBlueButton
                variant="contained"
                className="bg-[#E03201] font-baloo hover:bg-blue-600"
                onClick={() => setShowRegister(true)}
                Blue={true}
              >
                {t('buttons.signUp')}
              </MuiBlueButton>
            </>
          )}
        </div>

        <div className="md:hidden">
          <IconButton onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
          <MuiStyledDrawer
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            profileData={{ name: 'User', avatarUrl: '/path-to-avatar.jpg' }}
          >
            <Box
              sx={{ width: 250, backgroundColor: 'gray.900' }}
              role="presentation"
              onClick={() => setMenuOpen(false)}
              onKeyDown={() => setMenuOpen(false)}
            >
              <List>
                {menuItems.map(({ name, icon, link, external }) => (
                  <ListItem
                    key={name}
                    component="button"
                    onClick={() =>
                      external
                        ? window.open(link, '_blank')
                        : (window.location.href = link)
                    }
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '50px',
                        transform: 'scale(1.05)',
                        transition:
                          'transform 0.3s ease, background-color 0.3s ease',
                      },
                    }}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
                {!isLoggedIn && (
                  <>
                    <ListItem
                      component="button"
                      onClick={() => setShowLogin(true)}
                      sx={{
                        backgroundColor: 'red',
                        borderRadius: '50px',
                        '&:hover': {
                          backgroundColor: 'darkred',
                          transform: 'scale(1.05)',
                          transition:
                            'transform 0.3s ease, background-color 0.3s ease',
                        },
                      }}
                    >
                      <ListItemText primary={t('buttons.login')} />
                    </ListItem>
                    <ListItem
                      component="button"
                      onClick={() => setShowRegister(true)}
                      sx={{
                        borderRadius: '50px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          transform: 'scale(1.05)',
                          transition:
                            'transform 0.3s ease, background-color 0.3s ease',
                        },
                      }}
                    >
                      <ListItemText primary={t('buttons.signUp')} />
                    </ListItem>
                  </>
                )}
              </List>
            </Box>
          </MuiStyledDrawer>
        </div>
      </Toolbar>
    </AppBar>
  );
}
