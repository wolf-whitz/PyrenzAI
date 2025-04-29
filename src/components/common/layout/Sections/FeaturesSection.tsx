import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { FeatureCard } from '@components/index';
import { useTranslation } from 'react-i18next';

const cardData = [
  {
    cardNameKey: 'features.smartFastFree',
    cardDescriptionKey: 'features.smartFastFreeDescription',
    cardImage: 'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/ChattingExample.avif',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardNameKey: 'features.helpfulCommunity',
    cardDescriptionKey: 'features.helpfulCommunityDescription',
    cardImage: 'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Pyrenz.avif',
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

export default function FeaturesSection({ discoverMoreRef }: FeaturesSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.section
      ref={discoverMoreRef}
      data-aos="fade-up"
      className="p-10 text-white pb-32 md:pb-16"
    >
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Why Choose Pyrenz<span className="text-red-500">AI</span>?
      </h2>
      <div className="mt-8 space-y-12 md:space-y-16">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center space-y-8 md:space-y-0 md:space-x-8`}
          >
            <div className="md:order-2 flex flex-col items-center md:items-start space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center md:text-left">
                {t(card.cardNameKey)}
              </h3>
              <p className="opacity-90 max-w-prose text-center md:text-left">
                {t(card.cardDescriptionKey)}
              </p>
            </div>
            <FeatureCard
              cardName={t(card.cardNameKey)}
              cardImage={card.cardImage}
              imageWidth={card.imageWidth}
              imageHeight={card.imageHeight}
              className="md:order-1 mt-4 md:mt-0"
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
