import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { FeatureCard } from '@components/index';

const cardData = [
  {
    cardName: 'Smart. Fast. Free.',
    cardDescription:
      'Talk to characters anytime. No delays, no message limits just pure roleplay.',
  },
  {
    cardName: 'Tools For Creator',
    cardDescription:
      'Experience Pyrenz tools unleash your creativity with lorebooks, powerful model customization, and so much more',
  },
  {
    cardName: 'Unlimited Messages',
    cardDescription:
      'Free or not, welcome to PyrenzAi! We offer unlimited messages for free!',
  },
];

interface FeaturesSectionProps {
  discoverMoreRef: RefObject<HTMLElement>;
}

export default function FeaturesSection({ discoverMoreRef }: FeaturesSectionProps) {
  return (
    <motion.section
      ref={discoverMoreRef}
      data-aos="fade-up"
      className="p-10 text-white pb-32 md:pb-16"
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Why Choose Pyrenz<span className="text-red-500">AI</span>?
      </h2>
      <div className="space-y-8">
        {cardData.map((card, index) => (
          <div key={index} className="flex flex-col md:flex-row-reverse items-center space-y-4 md:space-y-0 md:space-x-8">
            <FeatureCard index={index} />
            <div className="flex flex-col items-end">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{card.cardName}</h3>
              <p className="opacity-90 max-w-prose text-right">{card.cardDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
