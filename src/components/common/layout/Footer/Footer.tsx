import { useState, useEffect } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { CardContent } from '~/components';
import { motion } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src =
                'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif';
              img.onload = () => {
                setImageSrc(img.src);
                setImageLoaded(true);
              };
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      const target = document.querySelector('.bg-cover-container');
      if (target) observer.observe(target);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (target) observer.unobserve(target);
      };
    }
  }, []);

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
        fontFamily: 'Fredoka',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '90%',
          maxWidth: '650px',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: 'none',
          background: 'transparent',
        }}
      >
        <CardContent
          className="bg-cover-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '160px',
            color: '#fff',
            backgroundImage: imageLoaded
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageSrc}')`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: 'none',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            transition: 'all 0.3s',
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={(e: React.MouseEvent<HTMLDivElement>) =>
            setMousePosition({ x: e.clientX, y: e.clientY })
          }
        >
          {hovering && (
            <motion.div
              style={{
                position: 'absolute',
                width: '5rem',
                height: '5rem',
                backgroundColor: '#fff',
                opacity: 0.2,
                borderRadius: '50%',
                pointerEvents: 'none',
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(10px)',
                mixBlendMode: 'overlay',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <Typography
            variant="h4"
            component="h1"
            style={{ textAlign: 'center' }}
          >
            {t('banner.joinDiscordTitle')}
          </Typography>
        </CardContent>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05, color: '#60a5fa' }}
        transition={{ duration: 0.3 }}
      >
        <Button
          component="a"
          href="https://discord.gg/zTcyP4WB8h"
          target="_blank"
          rel="noopener noreferrer"
          variant="text"
          startIcon={<FaDiscord size={30} />}
          style={{
            color: '#fff',
            fontSize: '1.125rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {t('buttons.joinDiscord')}
        </Button>
      </motion.div>
    </motion.div>
  );
}
