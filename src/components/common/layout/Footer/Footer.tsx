import { useState, useEffect } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { CardContent } from '~/components';
import { motion } from 'framer-motion';

export default function Footer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = 'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif';
              img.onload = () => {
                setImageSrc(img.src);
                setImageLoaded(true);
              };
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      const target = document.querySelector('.bg-cover-container');
      if (target) observer.observe(target);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (target) observer.unobserve(target);
      };
    }
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center space-y-5 mb-8 font-fredoka"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-[90%] max-w-[650px] rounded-2xl overflow-hidden border-none bg-transparent"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <CardContent
          className={`relative flex flex-col justify-center items-center h-[160px] text-white bg-cover bg-center border-none bg-transparent overflow-hidden transition-all bg-cover-container`}
          style={{
            backgroundImage: imageLoaded
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageSrc}')`
              : 'none',
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={(e: React.MouseEvent<HTMLDivElement>) =>
            setMousePosition({ x: e.clientX, y: e.clientY })
          }
        >
          {hovering && (
            <motion.div
              className="absolute w-20 h-20 bg-white opacity-20 rounded-full pointer-events-none"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(10px)',
                mixBlendMode: 'overlay',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <h1 className="text-2xl md:text-3xl font-bold relative text-center">
            Join The Discord Server Or Else...
          </h1>
        </CardContent>
      </motion.div>

      <motion.a
        href="https://discord.gg/zTcyP4WB8h"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-white text-lg font-semibold"
        whileHover={{ scale: 1.05, color: '#60a5fa' }}
        transition={{ duration: 0.3 }}
      >
        <FaDiscord size={30} />
        Join Discord
      </motion.a>
    </motion.div>
  );
}
