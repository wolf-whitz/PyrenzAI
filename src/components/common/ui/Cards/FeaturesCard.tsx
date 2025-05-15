import { motion } from 'framer-motion';
import clsx from 'clsx';
import Tilt from 'react-parallax-tilt';
import CardMedia from '@mui/material/CardMedia';

interface FeatureCardProps {
  cardImage: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
}

export default function FeatureCard({
  cardImage,
  imageWidth,
  imageHeight,
  className,
}: FeatureCardProps) {
  return (
    <Tilt
      className={clsx(
        'group bg-gray-800 text-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl border-2 border-red-500 max-w-sm md:max-w-xs mx-auto relative flex transition-transform duration-300',
        className
      )}
      tiltMaxAngleX={20}
      tiltMaxAngleY={20}
      scale={1.05}
      perspective={1000}
      transitionSpeed={400}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          scale: 1.05,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        role="article"
      >
        <CardMedia
          component="img"
          image={cardImage}
          alt=""
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          style={{ width: imageWidth, height: imageHeight }}
        />
      </motion.div>
    </Tilt>
  );
}
