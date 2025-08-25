import { Box, Typography } from '@mui/material';
import { PyrenzBlueButton, PyrenzModal, PyrenzModalContent } from '~/theme';

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
  const handleGumroadClick = () => {
    window.location.href = 'https://whitzscott.gumroad.com/';
  };

  const price = isMonthly
    ? plan?.price_count_monthly
    : plan?.price_count_yearly;

  return (
    <PyrenzModal open={isOpen} onClose={onClose}>
      <PyrenzModalContent>
        <Typography variant="h6" gutterBottom>
          Payment for {plan?.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Price:</strong> {price}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          <strong>Important when buying:</strong> PyrenzAI does not offer
          refunds after <strong>7 days</strong> from the purchase date.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleGumroadClick}
            sx={{
              backgroundColor: '#36a9ae',
              color: 'white',
              '&:hover': {
                backgroundColor: '#2a8890',
              },
            }}
          >
            <img
              src="/Favicons/Gumroad.avif"
              alt="Gumroad"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Buy via Gumroad
          </PyrenzBlueButton>
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
