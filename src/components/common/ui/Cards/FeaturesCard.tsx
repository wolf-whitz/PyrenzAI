import { motion } from 'framer-motion';
import classNames from 'classnames';

interface FeatureCardProps {
  cardName: string;
  cardImage: string;
  imageWidth: number;
  imageHeight: number;
  className?: string;
}

export default function FeatureCard({
  cardName,
  cardImage,
  imageWidth,
  imageHeight,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      data-aos="zoom-in"
      whileHover={{
        scale: 1.05,
        rotateX: 10,
        rotateY: 10,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={classNames(
        'group bg-gray-800 text-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl border-2 border-red-500 max-w-sm md:max-w-xs mx-auto relative flex max-h-[25rem] transition-transform duration-300 [--perspective:800px] [--rotate:-25deg] group-even:[--rotate:25deg] group-hover:[--rotate:-20deg] group-even:group-hover:[--rotate:20deg]',
        className
      )}
      role="article"
      aria-labelledby={`card-title-${cardName}`}
      aria-describedby={`card-description-${cardName}`}
    >
      <img
        src={cardImage}
        alt={cardName}
        loading="lazy"
        width={imageWidth}
        height={imageHeight}
        className="rounded-lg w-full"
        aria-hidden="true"
      />
    </motion.div>
  );
}
