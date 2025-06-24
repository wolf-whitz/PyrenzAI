import { useState } from 'react';
import {
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slide,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CommunityGuidelinesProps {
  className?: string;
}

export function CommunityGuidelines({ className }: CommunityGuidelinesProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const guidelines = [
    {
      primary: "No underage characters or any depictions resembling minors are allowed in any form. This includes visual art, written descriptions, dialogue, or implications. All characters must be unambiguously 18 years or older. Content that even slightly suggests underage characteristics such as childlike appearance, behavior, proportions, or references to school-age settings is strictly prohibited.",
    },
    {
      primary: "No incest or NSFW family-related content is allowed. This includes any sexual or suggestive scenarios involving family members by blood, marriage, adoption, or implied relationships. All content must avoid any familial context in adult or explicit material.",
    },
    {
      primary: "No bestiality or non-anthropomorphic animal content is allowed. Any explicit content involving animals or creatures that are not clearly humanized with sentient, anthropomorphic traits is strictly prohibited.",
    },
    {
      primary: "No extreme or graphic violence, gore, torture, or fetishized harm. Content must avoid any themes that glorify abuse, mutilation, or suffering in a sexual or explicit context.",
    },
  ];

  return (
    <Slide direction="left" in={isVisible} mountOnEnter unmountOnExit timeout={500}>
      <div className={`bg-gray-900 text-white p-6 rounded-lg shadow-xl sm:fixed sm:top-0 sm:right-0 sm:h-screen sm:w-72 sm:overflow-y-auto md:fixed md:top-0 md:right-0 md:h-screen md:w-72 md:overflow-y-auto relative ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" component="h2" className="text-2xl font-bold pb-2">
            Community Guidelines
          </Typography>
          <IconButton onClick={handleRemove} className="text-white sm:absolute sm:right-6 sm:top-6">
            <CloseIcon />
          </IconButton>
        </div>
        <Divider className="border-gray-700 mb-6 w-full" />
        <Fade in={isVisible} timeout={300}>
          <div className="overflow-hidden">
            <List className="space-y-4 list-disc list-inside pl-4 marker:text-white">
              {guidelines.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={<Typography variant="body1">{item.primary}</Typography>} />
                </ListItem>
              ))}
            </List>
          </div>
        </Fade>
      </div>
    </Slide>
  );
}
