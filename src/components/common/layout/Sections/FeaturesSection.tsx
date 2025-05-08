import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { FeatureCard } from '@components/index';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Grid } from '@mui/material';

const cardData = [
  {
    cardNameKey: 'features.smartFastFree',
    cardDescriptionKey: 'features.smartFastFreeDescription',
    cardImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/ChattingExample.avif',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardNameKey: 'features.helpfulCommunity',
    cardDescriptionKey: 'features.helpfulCommunityDescription',
    cardImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Pyrenz.avif',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardNameKey: 'features.openSourced',
    cardDescriptionKey: 'features.openSourcedDescription',
    cardImage: 'https://avatars1.githubusercontent.com/u/9919',
    imageWidth: 400,
    imageHeight: 300,
  },
];

interface FeaturesSectionProps {
  discoverMoreRef: RefObject<HTMLElement>;
}

export default function FeaturesSection({
  discoverMoreRef,
}: FeaturesSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.section
      ref={discoverMoreRef}
      data-aos="fade-up"
      style={{ padding: '2.5rem 1rem', paddingBottom: '8rem', color: 'white' }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(to right, #fff, #9ca3af)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Why Choose Pyrenz<span style={{ color: '#ef4444' }}>AI</span>?
        </Typography>
        <Box mt={4}>
          {cardData.map((card, index) => (
            <Grid
              container
              key={index}
              spacing={4}
              direction={index % 2 === 0 ? 'row' : 'row-reverse'}
              alignItems="center"
              sx={{ mb: index < cardData.length - 1 ? 6 : 0 }}
            >
              <Grid size={{ xs: 12, md: 6 }} component="div">
                <Box textAlign={{ xs: 'center', md: 'left' }}>
                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(to right, #fff, #9ca3af)',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {t(card.cardNameKey)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mt: 2 }}>
                    {t(card.cardDescriptionKey)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} component="div">
                <FeatureCard cardImage={card.cardImage} />
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>
    </motion.section>
  );
}
