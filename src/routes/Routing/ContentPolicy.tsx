import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Sidebar, MobileNav } from '@components';

const PolicyText = `## PyrenzAI Content Removal Policy

At PyrenzAI, we are committed to maintaining a safe, respectful, and legally compliant environment for all users. As such, we reserve the right to review, moderate, and remove any user-generated characters that violate our policies.

## Content Violations

We will delete or restrict access to any characters that include but are not limited to the following:

Pornographic content of any kind  
Child sexual abuse material (CSAM) or any content suggestive of or adjacent to CSAM  
Human-faced characters, whether real, AI-generated, or synthetic (deepfakes, celebrity likenesses, etc.)  
Racist, hateful, or discriminatory characters or content  
Child characters in any context that violates child safety policies  
Content involving:  
Rape or non-consensual acts  
Incest  
Bestiality  
Pedophilia or attraction to minors  
Any other content that promotes or normalizes illegal, violent, or harmful behavior

## Enforcement

Characters found in violation of these rules may be deleted without notice. Repeated or severe violations may result in account warnings, suspensions, or permanent bans.

We take these issues seriously. If you're unsure whether a character is allowed, err on the side of caution or reach out to our support team.

`;

export function ContentPolicy() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile ? (
        <MobileNav setShowLoginModal={setShowLoginModal} />
      ) : (
        <Sidebar />
      )}

      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flex: 1,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => {
                const { ref, ...rest } = props;
                return (
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    {...rest}
                  />
                );
              },
              h2: ({ node, ...props }) => {
                const { ref, ...rest } = props;
                return (
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    {...rest}
                  />
                );
              },
              p: ({ node, ...props }) => {
                const { ref, ...rest } = props;
                return (
                  <Typography
                    variant="body1"
                    component="p"
                    paragraph
                    {...rest}
                  />
                );
              },
              ul: ({ node, ...props }) => (
                <ul style={{ margin: 0, paddingLeft: '24px' }} {...props} />
              ),
              li: ({ node, ...props }) => {
                const { ref, ...rest } = props;
                return (
                  <li>
                    <Typography component="span" variant="body1" {...rest} />
                  </li>
                );
              },
            }}
          >
            {PolicyText}
          </ReactMarkdown>
        </Box>
      </Container>
    </Box>
  );
}
