import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import {
  LayoutRenderer,
  renderDoc,
  docPath,
  Sidebar,
  MobileNav,
  PreviewHeader,
} from '@components';

const MotionButtonBase = motion(ButtonBase);

const GlassyActionRow = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionButtonBase
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        p: 3,
        mt: 5,
        borderRadius: '0.75rem',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box>
        <Typography
          variant="button"
          sx={{
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
          }}
        >
          Next
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#ccc',
            fontWeight: 500,
            mt: 0.3,
          }}
        >
          {label}
        </Typography>
      </Box>

      <motion.div
        animate={{ x: isHovered ? 6 : 0 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <ChevronRightIcon
          sx={{
            color: '#fff',
            fontSize: 24,
            transition: 'color 0.3s ease',
          }}
        />
      </motion.div>
    </MotionButtonBase>
  );
};

export function DocPage() {
  const { doc_name } = useParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const isValidSlug = docPath.pages.some((page) => page.slug === doc_name);
  const slug = isValidSlug ? doc_name : docPath.default;

  const { meta, content } = renderDoc(slug);

  const handleNext = () => {
    const currentIndex = docPath.pages.findIndex((page) => page.slug === slug);
    const nextIndex = (currentIndex + 1) % docPath.pages.length;
    const nextSlug = docPath.pages[nextIndex].slug;
    navigate(`/docs/${nextSlug}`);
  };

  const currentIndex = docPath.pages.findIndex((page) => page.slug === slug);
  const nextIndex = (currentIndex + 1) % docPath.pages.length;
  const nextPageTitle = docPath.pages[nextIndex].title;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <PreviewHeader
          setShowLogin={setShowLoginModal}
          setShowRegister={setShowRegisterModal}
        />
      </Box>

      {meta.banner && (
        <Box
          component="img"
          src={meta.banner}
          alt={`${meta.title} Banner`}
          sx={{
            width: '100%',
            height: { xs: '200px', sm: '300px', md: '300px' },
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sidebar />
        </Box>

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileNav setShowLoginModal={setShowLoginModal} />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            maxWidth: '900px',
            width: '100%',
            ml: { md: '10px', xs: 0 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: { xs: '56px', md: '0' },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.75rem' },
              mb: 1,
              textAlign: 'center',
            }}
          >
            {meta.title}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ textAlign: 'center' }}
          >
            {meta.description}
          </Typography>

          <LayoutRenderer meta={meta} content={content} />

          <GlassyActionRow label={nextPageTitle} onClick={handleNext} />
        </Box>
      </Box>
    </Box>
  );
}
