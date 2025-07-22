import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar, MobileNav } from '@components'
import { Utils } from '~/Utility'
import type { User } from '@supabase/supabase-js'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { PyrenzBlueButton } from '~/theme'
import { Account, Profile, Persona, Api } from './Items'

const tabs = ['account', 'profile', 'persona', 'api'] as const

export function Setting() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('account')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const theme = useTheme()
  const isMedium = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: sessionData, error: sessionError } =
        await Utils.db.client.auth.getSession()
      if (sessionError || !sessionData.session) {
        setLoading(false)
        return
      }
      const { data: userData, error: userError } =
        await Utils.db.client.auth.getUser()
      if (!userError && userData?.user) setUser(userData.user)
      setLoading(false)
    }
    init()
  }, [])

  const renderTabs = () => {
    if (!user) return null

    const getTabs = (arr: readonly string[]) =>
      arr.map((tab) => (
        <Tab
          key={tab}
          value={tab}
          label={
            <PyrenzBlueButton
              sx={{
                border: activeTab === tab ? '2px solid #66ccff' : '2px solid transparent',
                borderRadius: '12px',
                transition: 'all 0.3s ease-in-out',
                color: activeTab === tab ? '#aee4ff' : '#ffffff',
                fontWeight: activeTab === tab ? 700 : 500,
                px: 3,
                py: 1.2,
                background: activeTab === tab
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.15)',
                  color: '#aee4ff',
                },
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </PyrenzBlueButton>
          }
        />
      ))

    if (isMedium) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
          gap={2}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ width: 'fit-content' }}
          >
            {getTabs(tabs.slice(0, 2))}
          </Tabs>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ width: 'fit-content' }}
          >
            {getTabs(tabs.slice(2))}
          </Tabs>
        </Box>
      )
    }

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        gap={2}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ width: 'fit-content' }}
        >
          {getTabs(tabs)}
        </Tabs>
      </Box>
    )
  }

  const Content = () => {
    switch (activeTab) {
      case 'account':
        return <Account />
      case 'profile':
        return <Profile />
      case 'persona':
        return <Persona />
      case 'api':
        return <Api />
      default:
        return null
    }
  }

  return (
    <Box display="flex">
      <Sidebar />
      <Box
        flexGrow={1}
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {renderTabs()}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Box maxWidth="md" width="100%" mb={isMedium ? '56px' : 0}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
              >
                <CircularProgress />
              </Box>
            ) : !user && activeTab === 'account' ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
              >
                <Typography variant="h6" color="textSecondary">
                  Please log in to access your account settings.
                </Typography>
              </Box>
            ) : (
              <Content />
            )}
          </Box>
        </motion.div>
      </Box>
      {isMedium && <MobileNav setShowLoginModal={() => {}} />}
    </Box>
  )
}
