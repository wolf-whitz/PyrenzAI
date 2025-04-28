import { motion } from 'framer-motion';

const cardData = [
  {
    cardName: 'Smart. Fast. Free.',
    cardImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/ChattingExample.avif',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardName: 'Helpful Community',
    cardImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Pyrenz.avif',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardName: 'OpenSourced',
    cardImage:
      'https://avatars1.githubusercontent.com/u/9919',
    imageWidth: 400,
    imageHeight: 300,
  },
];

interface FeatureCardProps {
  index: number;
}

export default function FeatureCard({ index }: FeatureCardProps) {
  const card = cardData[index];

  return (
    <motion.div
      data-aos="zoom-in"
      whileHover={{
        scale: 1.05,
        rotateX: 10,
        rotateY: 10,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-gray-800 text-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl  border-2 border-red-500 md:max-w-xs mx-auto relative flex max-h-[25rem] transition-transform duration-300 [--perspective:800px] [--rotate:-25deg] group-even:[--rotate:25deg] group-hover:[--rotate:-20deg] group-even:group-hover:[--rotate:20deg]"
      role="article"
      aria-labelledby={`card-title-${index}`}
      aria-describedby={`card-description-${index}`}
    >
      <img
        src={card.cardImage}
        alt={card.cardName}
        loading="lazy"
        width={card.imageWidth}
        height={card.imageHeight}
        className="rounded-lg w-full"
        aria-hidden="true"
      />
    </motion.div>
  );
}
