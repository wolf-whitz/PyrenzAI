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

const PolicyText = `
# Privacy Policy  
**Effective Date:** June 7, 2025  
**Company Name:** PyrenzAI

At PyrenzAI, we are committed to protecting your privacy and ensuring that your data is handled in a transparent and lawful manner. This Privacy Policy outlines how we collect, use, and manage your information, as well as our policies regarding acceptable use.

## 1. Eligibility  
PyrenzAI services are strictly intended for users 18 years of age or older. Minors are not permitted to use our services under any circumstances. By accessing or using our services, you confirm that you are at least 18 years old.

## 2. Data Collection and Use  
We collect minimal information necessary to maintain and improve our services. Specifically:

- **Cookies and Tracking:** We use cookies solely for error tracking and service stability purposes. These cookies help us diagnose issues and enhance performance.  
- **GDPR Compliance:** Under the General Data Protection Regulation (GDPR), you have the right to access, correct, or delete your personal data. If you wish to exercise any of these rights, please contact us at [support@pyrenzai.com](mailto:support@pyrenzai.com).

We do not sell, share, or use personal data for profiling or marketing.

## 3. User Data Handling and Responsibility  
PyrenzAI handles user data (including messages, API keys, and other sensitive information) with care and secure practices by default. However, **PyrenzAI is not responsible** for any misuse, exposure, or security incidents resulting from:

- Users mishandling their own data  
- Users sharing their API keys with third parties  
- Users posting their login credentials publicly  
- Any other negligence in safeguarding personal information

Users are solely responsible for maintaining the confidentiality and security of their accounts and credentials.

**Account Deletion:**  
If a user deletes their account and associated data, **PyrenzAI will not retain any personal information or content associated with that account**. Deletion is permanent and unrecoverable.

## 4. Refund Policy  
Users are eligible to request a refund within five (5) calendar days of the original purchase date. Refund requests made after this period may not be honored. To initiate a refund, please contact our support team with proof of purchase.

## 5. Prohibited Content  
The following content is strictly prohibited on PyrenzAI:

- Pornography of any kind  
- Child sexual abuse material (CSAM) or any related content  
- Any content featuring human-faced characters, whether real, generated, or synthetic  
- Racist characters or hate-based content  
- Child characters in any context that violates child safety policies  
- Content involving rape, incest, bestiality, or pedophilia  
- Any other content promoting or normalizing illegal, violent, or harmful behavior

Violation of these restrictions will result in immediate account suspension or termination and may be reported to the appropriate authorities if required.

## 6. AI-Generated Content Disclaimer  
PyrenzAI uses AI systems to generate text and other outputs based on user input. While we strive for quality and relevance, **PyrenzAI does not guarantee that AI-generated responses are accurate, factual, or suitable for any specific purpose**. Use of generated content is at your own discretion and risk.

**Character Safety & Visibility:**  
PyrenzAI does not guarantee the safety, security, or appropriateness of AI-generated characters. **Generated characters may be publicly visible by default**, and it is the user's responsibility to mark characters as private if needed.

## 7. Policy Updates  
This Privacy Policy may be updated periodically. When changes are made, the effective date at the top of this page will be revised. Continued use of our services after any update constitutes acceptance of the new terms.

## 8. Contact Us  
If you have any questions regarding this Privacy Policy, or wish to exercise your data rights under GDPR, please contact:

**PyrenzAI Support Team**  
[support@pyrenzai.com](mailto:support@pyrenzai.com)

By using PyrenzAI, you agree to the terms of this Privacy Policy.

`;

export function Policy() {
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
                    className="font-baloo"
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
                    className="font-baloo"
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
                    className="font-baloo"
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
                  <li className="font-baloo">
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
