import React from 'react';
import { Card, CardContent, CardActions, Typography, Box } from '@mui/material';
import { PyrenzBlueButton, PyrenzRibbon } from '~/theme';

interface SubscriptionPlan {
  title: string;
  price_count: string;
  descriptions: string[];
  color?: string;
  backgroundImage?: string;
  plan_identifier?: string;
}

interface SubscriptionCardsProps {
  plan: SubscriptionPlan;
  isSubscribed: boolean;
  onSubscribe: (title: string) => void;
}

export function SubscriptionCard({ plan, isSubscribed, onSubscribe }: SubscriptionCardsProps) {
  const parseDescription = (description: string) => {
    const parts = description.split('\n');
    const title = parts[0].replace(/^###\s/, '');
    const content = parts.slice(1, -1).join('\n');
    const color = parts[parts.length - 1];
    return { title, content, color };
  };

  return (
    <Card sx={{
      flex: 1,
      minWidth: 250,
      maxWidth: 300,
      boxShadow: 3,
      borderRadius: 2,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6,
      },
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: plan.color ? `2px solid ${plan.color}` : 'none',
      backgroundImage: `url(${plan.backgroundImage})`,
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 0,
      },
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}>
      {plan.plan_identifier === "durian" && (
        <PyrenzRibbon color={plan.color} sx={{ position: 'absolute', top: 30, right: 5, zIndex: 2 }}>
          Popular
        </PyrenzRibbon>
      )}
      <CardContent sx={{
        textAlign: 'center',
        flexGrow: 1,
        position: 'relative',
        zIndex: 1,
        color: 'white',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="h5" color="inherit" sx={{ mb: 1 }}>
          {plan.title}
        </Typography>
        <Typography variant="body1" color="inherit" sx={{ mb: 1 }}>
          {plan.price_count}
        </Typography>
        {plan.descriptions.map((description, i) => {
          const { title, content, color } = parseDescription(description);
          return (
            <Box key={i} sx={{ mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: color,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}
                color-id={color}
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
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        <PyrenzBlueButton
          variant="contained"
          onClick={() => onSubscribe(plan.title)}
          disabled={isSubscribed}
          sx={{ backgroundColor: plan.color }}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </PyrenzBlueButton>
      </CardActions>
    </Card>
  );
}
