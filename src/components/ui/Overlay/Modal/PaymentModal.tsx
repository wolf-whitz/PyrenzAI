import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    title: string;
    price_count_monthly: string;
    price_count_yearly: string;
  } | null;
  isMonthly: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  plan,
  isMonthly,
}: PaymentModalProps) {
  const handleKofiClick = () => {
    window.location.href = 'https://ko-fi.com/whitzscott';
  };

  const handleStoreClick = () => {
    console.log(`Proceeding to Store payment for ${plan?.title}`);
  };

  const price = isMonthly
    ? plan?.price_count_monthly
    : plan?.price_count_yearly;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
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
        }}
      >
        <Typography variant="h6" gutterBottom>
          Payment for {plan?.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Price:</strong> {price}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          <strong>Important when buying:</strong> PyrenzAI does not offer
          automatic refunds after <strong>3 days</strong> from the purchase
          date. Exceptions may apply to payments made through the store.
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleKofiClick}
            sx={{
              borderRadius: '20px',
              backgroundColor: '#FF5E5B',
              color: 'white',
              '&:hover': {
                backgroundColor: '#E04746',
              },
            }}
          >
            <img
              src="/Favicons/Kofi.png"
              alt="Kofi"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Support via Kofi
          </PyrenzBlueButton>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleStoreClick}
            sx={{
              borderRadius: '20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#3E8E41',
              },
            }}
          >
            <img
              src="/Favicons/Fastspring.png"
              alt="FastSpring"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Buy via Store
          </PyrenzBlueButton>
        </Box>
      </Box>
    </Modal>
  );
}
