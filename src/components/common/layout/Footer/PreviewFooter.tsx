import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';

export default function PreviewFooter() {
  const { t } = useTranslation();

  const legalLinks = t('footer.legal', { returnObjects: true });

  return (
    <footer className="bg-transparent py-10 w-screen animate__animated animate__fadeInUp animate__slow">
      <Container maxWidth="lg">
        <div className="flex flex-wrap justify-between items-start">
          <div className="w-full md:w-1/3 px-6">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                borderBottom: '2px solid #E03201',
                paddingBottom: '4px',
              }}
            >
              {t('footer.quickLinks')}
            </Typography>
            <List>
              {[
                { name: t('navigation.home'), path: '/Home' },
                { name: t('footer.links.explore'), path: '/Explore' },
                { name: t('navigation.chats'), path: '/Chats' },
                {
                  name: t('footer.links.discord'),
                  path: 'https://discord.com',
                },
              ].map((item, index) => (
                <ListItem className="group" key={index}>
                  <Link
                    href={item.path}
                    sx={{
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E03201',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <ListItemText primary={item.name} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </div>

          <div className="w-full md:w-1/3 px-6 mt-8 md:mt-0">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                borderBottom: '2px solid #E03201',
                paddingBottom: '4px',
              }}
            >
              {t('footer.links.guide')}
            </Typography>
            <List>
              {[
                { name: t('footer.links.botCreation'), path: 'https://pyrenz-ai.gitbook.io/pyrenz-ai/bot-creation' },
                { name: t('footer.links.howTokenWorks'), path: 'https://pyrenz-ai.gitbook.io/pyrenz-ai/how-tokens-work' },
                { name: t('footer.links.lorebooks'), path: 'https://pyrenz-ai.gitbook.io/pyrenz-ai/lorebooks' },
              ].map((item, index) => (
                <ListItem className="group" key={index}>
                  <Link
                    href={item.path}
                    sx={{
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E03201',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <ListItemText primary={item.name} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </div>

          <div className="w-full md:w-1/3 px-6 mt-8 md:mt-0">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                borderBottom: '2px solid #E03201',
                paddingBottom: '4px',
              }}
            >
              Legal
            </Typography>
            <List>
              {Object.entries(legalLinks).map(([key, value], index) => (
                <ListItem className="group" key={index}>
                  <Link
                    href={`/${key.toLowerCase()}`}
                    sx={{
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E03201',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <ListItemText primary={value} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </div>
        </div>

        <div className="w-full text-center mt-12 pt-4 text-sm text-white opacity-75">
          © {new Date().getFullYear()} Pyrenz AI.{' '}
          {t('messages.allRightsReserved')}
        </div>
      </Container>
    </footer>
  );
}
