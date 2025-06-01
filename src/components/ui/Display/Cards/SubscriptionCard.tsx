import React from 'react';
import { Card, CardContent, CardActions, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { PyrenzBlueButton, PyrenzRibbon } from '~/theme';

interface SubscriptionPlan {
  title: string;
  price_count_monthly: string;
  price_count_yearly: string;
  descriptions: string[];
  color?: string;
  backgroundImage?: string;
  plan_identifier?: string;
}

interface SubscriptionCardsProps {
  plan: SubscriptionPlan;
  isSubscribed: boolean;
  onSubscribe: (title: string) => void;
  isMonthly: boolean;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionButton = motion(PyrenzBlueButton);

const getRibbonText = (planIdentifier: string | undefined) => {
  switch (planIdentifier) {
    case 'durian':
      return 'Popular';
    case 'pineapple':
      return 'Latest';
    case 'melon':
      return 'Fastest';
    default:
      return null;
  }
};

export function SubscriptionCard({
  plan,
  isSubscribed,
  onSubscribe,
  isMonthly,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
}: SubscriptionCardsProps) {
  const parseDescription = (description: string) => {
    const parts = description.split('\n');
    const title = parts[0].replace(/^###\s/, '');
    const content = parts.slice(1, -1).join('\n');
    const color = parts[parts.length - 1];
    return { title, content, color };
  };

  const price = isMonthly ? plan.price_count_monthly : plan.price_count_yearly;
  const ribbonText = getRibbonText(plan.plan_identifier);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <MotionCard
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: isHighlighted ? 10 : 3,
          borderRadius: 4,
          border: plan.color ? `2px solid ${plan.color}` : 'none',
          backgroundImage: `url(${plan.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 350, // Maximum width for larger screens
          width: '100%', // Full width for smaller screens
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{
          opacity: isHighlighted ? 1 : 0.5,
          scale: isHighlighted ? 1 : 0.9,
        }}
        whileHover={{ opacity: 1, scale: 1.05, zIndex: 3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 0,
          }}
        />
        {ribbonText && (
          <PyrenzRibbon
            color={plan.color}
            sx={{
              position: 'absolute',
              top: 50,
              right: -20,
              zIndex: 2,
              transform: 'rotate(45deg)',
            }}
          >
            {ribbonText}
          </PyrenzRibbon>
        )}
        <CardContent
          sx={{
            textAlign: 'center',
            flexGrow: 1,
            position: 'relative',
            zIndex: 1,
            color: 'white',
            padding: 3,
          }}
        >
          <MotionTypography
            variant="h5"
            color="inherit"
            sx={{ mb: 2 }}
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {plan.title}
          </MotionTypography>
          <MotionTypography
            variant="h6"
            color="inherit"
            sx={{ mb: 3 }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {price}
          </MotionTypography>
          {plan.descriptions.map((description, i) => {
            const { title, content, color } = parseDescription(description);
            return (
              <Box key={i} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: color,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="inherit">
                  {content}
                </Typography>
              </Box>
            );
          })}
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', p: 3 }}>
          <MotionButton
            variant="contained"
            onClick={() => onSubscribe(plan.title)}
            disabled={isSubscribed}
            sx={{
              backgroundColor: plan.color,
              color: 'white',
              '&:hover': {
                backgroundColor: plan.color ? `${plan.color}CC` : undefined,
              },
              borderRadius: '20px',
              padding: '8px 24px',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </MotionButton>
        </CardActions>
      </MotionCard>
    </Box>
  );
}
