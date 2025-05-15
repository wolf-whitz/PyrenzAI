import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { FeatureCard } from '@components/index';
import { useTranslation } from 'react-i18next';
import { Typography, Container } from '@mui/material';

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
      className="py-10 px-4 pb-32 text-white"
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text"
          sx={{
            fontSize: '4.5rem',
            fontWeight: '600',
            mb: '1rem',
          }}
        >
          Why Choose Pyrenz<span className="text-red-500">AI</span>?
        </Typography>
        <div className="mt-16">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-24`}
            >
              <div className="md:w-1/2 text-center md:text-left">
                <Typography
                  variant="h4"
                  component="h3"
                  className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text"
                >
                  {t(card.cardNameKey)}
                </Typography>
                <Typography variant="body1" className="mt-4 opacity-90">
                  {t(card.cardDescriptionKey)}
                </Typography>
              </div>
              <div className="md:w-1/2">
                <FeatureCard cardImage={card.cardImage} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
