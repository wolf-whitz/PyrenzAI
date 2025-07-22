import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  HomeOutlined as HomeIcon,
  ChatOutlined as ChatIcon,
  Menu as MenuIcon,
  AutoAwesome as PyrenzPlusIcon,
  LoginOutlined as LoginIcon,
  PersonAddOutlined as PersonAddIcon,
  DescriptionOutlined as DescriptionIcon,
} from '@mui/icons-material'
import { FaDiscord } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Utils } from '~/Utility'
import { PyrenzStyledDrawer, PyrenzBlueButtonWithLoading } from '~/theme'
import { useUserStore } from '~/store'

interface HeaderProps {
  setShowLogin: (value: boolean) => void
  setShowRegister: (value: boolean) => void
}

export function PreviewHeader({ setShowLogin, setShowRegister }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()
  const isMediumOrSmaller = useMediaQuery(theme.breakpoints.down('md'))
  const subscriptionPlan = useUserStore((state) => state.subscription_plan)

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await Utils.db.client.auth.getSession()
      if (data.session) {
        setIsLoggedIn(true)
      } else if (error) {
        console.error('Error checking user session:', error)
      }
    }

    checkUserSession()
  }, [])

  const menuItems = [
    { name: t('navigation.home'), icon: <HomeIcon />, link: '/Home' },
    { name: t('navigation.chats'), icon: <ChatIcon />, link: '/Archive' },
    {
      name: 'Documentation',
      icon: <DescriptionIcon />,
      link: '/docs',
    },
    {
      name: t('footer.links.discord'),
      icon: <FaDiscord />,
      link: 'https://discord.gg/zTcyP4WB8h',
      external: true,
    },
  ]

  if (subscriptionPlan && subscriptionPlan.includes('Melon')) {
    menuItems.push({
      name: 'Pyrenz+',
      icon: <PyrenzPlusIcon />,
      link: '/Subscription',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: 'gray.900' }}
      >
        <Toolbar
          className="flex justify-between items-center w-full max-w-screen-2xl mx-auto px-6"
          sx={{ overflowX: 'hidden' }}
        >
          <div
            className="flex items-center space-x-4 cursor-pointer lg:ml-[60px]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/favicon.png"
              alt={t('footer.pyrenzLogo')}
              className="h-8 w-8"
            />
            <div className="text-2xl font-bold font-pyrenzfont hover:text-white transition-colors duration-300">
              Pyrenz<span className="text-[#add8e6]">AI</span>
            </div>
          </div>

          {!isMediumOrSmaller && (
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map(({ name, icon, link, external }) => (
                <PyrenzBlueButtonWithLoading
                  key={name}
                  startIcon={icon}
                  sx={{
                    color: 'white',
                    background: 'transparent',
                    border: 'none',
                    '&:hover': {
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                    },
                  }}
                  className="font-pyrenzfont whitespace-nowrap"
                  onClick={() =>
                    external
                      ? window.open(link, '_blank')
                      : (window.location.href = link)
                  }
                >
                  {name}
                </PyrenzBlueButtonWithLoading>
              ))}

              {!isLoggedIn && (
                <>
                  <PyrenzBlueButtonWithLoading
                    startIcon={<LoginIcon />}
                    sx={{
                      color: 'white',
                      background: 'transparent',
                      border: 'none',
                      '&:hover': {
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                      },
                    }}
                    className="font-pyrenzfont whitespace-nowrap"
                    onClick={() => setShowLogin(true)}
                  >
                    {t('buttons.login')}
                  </PyrenzBlueButtonWithLoading>
                  <PyrenzBlueButtonWithLoading
                    startIcon={<PersonAddIcon />}
                    sx={{
                      color: 'white',
                      background: 'transparent',
                      border: 'none',
                      '&:hover': {
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                      },
                    }}
                    className="font-pyrenzfont whitespace-nowrap"
                    onClick={() => setShowRegister(true)}
                  >
                    {t('buttons.signUp')}
                  </PyrenzBlueButtonWithLoading>
                </>
              )}
            </div>
          )}

          {isMediumOrSmaller && (
            <div>
              <IconButton onClick={() => setMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
              <PyrenzStyledDrawer
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
              >
                <Box
                  sx={{ width: 250 }}
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
                          backgroundColor: 'transparent',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            color: 'white',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'inherit' }}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={name} />
                      </ListItem>
                    ))}
                    {!isLoggedIn && (
                      <>
                        <ListItem
                          component="button"
                          onClick={() => setShowLogin(true)}
                          sx={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: 'white',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <LoginIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('buttons.login')} />
                        </ListItem>
                        <ListItem
                          component="button"
                          onClick={() => setShowRegister(true)}
                          sx={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: 'white',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <PersonAddIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('buttons.signUp')} />
                        </ListItem>
                      </>
                    )}
                  </List>
                </Box>
              </PyrenzStyledDrawer>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  )
}
