import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    title: string;
    price_count: string;
  } | null;
}

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const handleKofiClick = () => {
    window.location.href = 'https://ko-fi.com/whitzscott';
  };

  const handleStoreClick = () => {
    console.log(`Proceeding to Store payment for ${plan?.title}`);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
      }}>
        <Typography variant="body1" gutterBottom>
        <strong>Important when buying:</strong> PyrenzAI does not offer automatic refunds after <strong>3 days</strong> from the purchase date. Exceptions may apply to payments made through the store.
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleKofiClick}
            sx={{ borderRadius: '0' }}
          >
            <img
              src="/Favicons/Kofi.png"
              alt="Kofi"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Kofi
          </PyrenzBlueButton>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleStoreClick}
            sx={{ borderRadius: '0' }}
          >
            <img
              src="/Favicons/Fastspring.png"
              alt="FastSpring"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Store
          </PyrenzBlueButton>
        </Box>
      </Box>
    </Modal>
  );
}
