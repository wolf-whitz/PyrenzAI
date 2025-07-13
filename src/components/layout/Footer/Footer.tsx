import { FaDiscord } from 'react-icons/fa';
import { MdOutlineMonitorHeart } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Typewriter from 'typewriter-effect';

export function Footer() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '2rem',
        fontFamily: 'Baloo, sans-serif',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '95%',
          maxWidth: '800px',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: 'none',
          background: 'transparent',
        }}
      >
        <Card
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Mascot-holdingGun.avif')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: 'none',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            transition: 'all 0.3s',
          }}
        >
          <CardContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '160px',
              color: '#fff',
              textAlign: 'center',
              padding: '1rem',
            }}
          >
            <Typography variant="h4" component="h1">
              <Typewriter
                options={{
                  strings: [
                    'Join the Discord server or else...',
                    'Enjoying the website?',
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                  deleteSpeed: 30,
                }}
              />
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <Button
            component="a"
            href="https://discord.gg/zTcyP4WB8h"
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            startIcon={<FaDiscord size={28} />}
            sx={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {t('buttons.joinDiscord')}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <Button
            component="a"
            href="https://stats.uptimerobot.com/BCu4M0Cgjf"
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            startIcon={<MdOutlineMonitorHeart size={26} />}
            sx={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            Uptime Status
          </Button>
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          href="/Policy"
          variant="body2"
          style={{ color: '#9ca3af', textAlign: 'center' }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/ContentPolicy"
          variant="body2"
          style={{ color: '#9ca3af', textAlign: 'center' }}
        >
          Content Removal
        </Link>
      </div>

      <Typography
        variant="body2"
        style={{ textAlign: 'center', color: '#6b7280', marginTop: '1rem' }}
      >
        © 2025 Pyrenz AI. {t('messages.allRightsReserved')}
      </Typography>
    </motion.div>
  );
}
