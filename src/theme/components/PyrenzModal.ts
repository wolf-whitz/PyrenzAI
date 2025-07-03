import { Modal, Box, styled } from '@mui/material';
import { motion } from 'framer-motion';

export const PyrenzModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});


/**
 * Bug 2: The `motion` part is depreciated in the latest versions of Framer Motion.
 * To fix this, we can use `motion.create` to create a motion component from the
 * MUI Box component.
 */
const MotionBox = motion.create(Box);

export const PyrenzModalContent = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.6), rgba(40, 40, 40, 0.5))',
  color: '#f0f0f0',
  borderRadius: '20px',
  padding: theme.spacing(5),
  boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  outline: '1px solid rgba(255, 255, 255, 0.05)',
  width: '600px',
  maxWidth: '90vw',
  height: 'auto',
  maxHeight: '85vh',
  overflowY: 'auto',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    padding: '1px',
    background: 'linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
    pointerEvents: 'none',
    zIndex: 1,
  },
}));
