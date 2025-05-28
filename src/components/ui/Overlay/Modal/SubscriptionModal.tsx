import React from 'react';
import { Modal, Box, Typography, Card, CardContent, CardHeader } from '@mui/material';

// JSON constant for subscription plans
const subscriptionPlans = [
  {
    title: "Melon",
    primaryText: "Free Messages",
    descriptions: [
      "Free messages for life, no subscription required.",
      "Access to our best free models."
    ]
  },
  {
    title: "Plan 2",
    primaryText: "Premium Features",
    descriptions: [
      "Description for Plan 2."
    ]
  },
  {
    title: "Plan 3",
    primaryText: "Ultimate Access",
    descriptions: [
      "Description for Plan 3."
    ]
  }
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 900,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Choose Your Plan
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 3,
        }}>
          {subscriptionPlans.map((plan, index) => (
            <Card key={index} sx={{
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
            }}>
              <CardHeader
                title={plan.title}
                titleTypographyProps={{ align: 'center', variant: 'h5' }}
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                  {plan.primaryText}
                </Typography>
                {plan.descriptions.map((description, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
