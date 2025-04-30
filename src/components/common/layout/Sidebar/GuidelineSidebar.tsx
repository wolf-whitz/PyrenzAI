import { motion } from 'framer-motion';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Typography, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function CommunityGuidelines({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-900 text-white p-6 rounded-lg shadow-xl sm:fixed sm:top-0 sm:right-0 sm:h-screen sm:w-72 sm:overflow-y-auto md:fixed md:top-0 md:right-0 md:h-screen md:w-72 md:overflow-y-auto relative ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" component="h2" className="text-2xl font-bold pb-2">
          Community Guidelines
        </Typography>
        <IconButton onClick={handleRemove} className="text-white sm:absolute sm:right-6 sm:top-6">
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </div>
      <Divider className="border-gray-700 mb-6 w-full" />
      <motion.div
        animate={{ height: 'auto' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <List className="space-y-4 list-disc list-inside pl-4 marker:text-white">
          <motion.div whileHover={{ x: 5 }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    No underage characters or any depictions resembling minors are allowed in any form. This includes visual art, written descriptions, dialogue, or implications. All characters must be unambiguously 18 years or older. Content that even slightly suggests underage characteristics such as childlike appearance, behavior, proportions, or references to school-age settings is strictly prohibited.
                  </Typography>
                }
              />
            </ListItem>
          </motion.div>
          <motion.div whileHover={{ x: 5 }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    No incest or NSFW family-related content is allowed. This includes any sexual or suggestive scenarios involving family members by blood, marriage, adoption, or implied relationships. All content must avoid any familial context in adult or explicit material.
                  </Typography>
                }
              />
            </ListItem>
          </motion.div>
          <motion.div whileHover={{ x: 5 }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    No bestiality or non-anthropomorphic animal content is allowed. Any explicit content involving animals or creatures that are not clearly humanized with sentient, anthropomorphic traits is strictly prohibited.
                  </Typography>
                }
              />
            </ListItem>
          </motion.div>
          <motion.div whileHover={{ x: 5 }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    No extreme or graphic violence, gore, torture, or fetishized harm. Content must avoid any themes that glorify abuse, mutilation, or suffering in a sexual or explicit context.
                  </Typography>
                }
              />
            </ListItem>
          </motion.div>
        </List>
      </motion.div>
    </motion.div>
  );
}
