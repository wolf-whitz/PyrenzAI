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
      primary:
        'No underage characters or any depictions resembling minors are allowed in any form. This includes visual art, written descriptions, dialogue, or implications. All characters must be unambiguously 18 years or older. Content that even slightly suggests underage characteristics such as childlike appearance, behavior, proportions, or references to school-age settings is strictly prohibited.',
    },
    {
      primary:
        'No incest or NSFW family-related content is allowed. This includes any sexual or suggestive scenarios involving family members by blood, marriage, adoption, or implied relationships. All content must avoid any familial context in adult or explicit material.',
    },
    {
      primary:
        'No bestiality or non-anthropomorphic animal content is allowed. Any explicit content involving animals or creatures that are not clearly humanized with sentient, anthropomorphic traits is strictly prohibited.',
    },
    {
      primary:
        'No extreme or graphic violence, gore, torture, or fetishized harm. Content must avoid any themes that glorify abuse, mutilation, or suffering in a sexual or explicit context.',
    },
  ];

  return (
    <Slide
      direction="left"
      in={isVisible}
      mountOnEnter
      unmountOnExit
      timeout={500}
    >
      <div
        className={`backdrop-blur-2xl bg-white/10 border border-white/20 text-white p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] sm:fixed sm:top-0 sm:right-0 sm:h-screen sm:w-80 sm:overflow-y-auto md:fixed md:top-0 md:right-0 md:h-screen md:w-80 md:overflow-y-auto relative transition-all duration-500 ease-in-out overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 pointer-events-none z-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-2xl opacity-30" />

        <div className="relative z-10 flex justify-between items-start mb-6">
          <Typography
            variant="h5"
            component="h2"
            className="text-2xl font-bold tracking-wide drop-shadow-lg"
          >
            Community Guidelines
          </Typography>
          <IconButton
            onClick={handleRemove}
            className="text-white hover:scale-110 hover:text-red-400 transition-all duration-300 ease-in-out sm:absolute sm:right-6 sm:top-6"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <Divider className="border-white/30 mb-6 w-full" />

        <Fade in={isVisible} timeout={300}>
          <div className="overflow-hidden">
            <List className="space-y-6 pl-2 custom-scrollbar pr-2">
              {guidelines.map((item, index) => (
                <ListItem
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        className="text-sm leading-relaxed text-white/90 group-hover:text-white"
                      >
                        {item.primary}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </Fade>
      </div>
    </Slide>
  );
}
