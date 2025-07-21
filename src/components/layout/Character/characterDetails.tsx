import { Box, Typography, Card, Divider } from '@mui/material';
import {
  MessageOutlined as MessageIcon,
  VisibilityOutlined as VisibilityIcon,
  ShieldOutlined as ShieldIcon,
} from '@mui/icons-material';

interface CharacterDetailsProps {
  character: any;
}

export function CharacterDetails({ character }: CharacterDetailsProps) {
  return (
    <Box component="section" flex={{ md: 2 }}>
      <Card
        sx={{
          backgroundColor: '#1E1E1E',
          color: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          component="h3"
          sx={{ fontWeight: 'bold' }}
        >
          Greeting
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          {character.first_message}
        </Typography>
        <Divider sx={{ my: 3, backgroundColor: '#333' }} />
        <Typography
          variant="h5"
          gutterBottom
          component="h3"
          sx={{ fontWeight: 'bold' }}
        >
          Description
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          {character.description}
        </Typography>
        <Divider sx={{ my: 3, backgroundColor: '#333' }} />
        <Typography
          variant="h6"
          gutterBottom
          component="h4"
          sx={{ fontWeight: 'bold' }}
        >
          Character Details
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flex={1} minWidth={150} display="flex" alignItems="center">
            <MessageIcon sx={{ mr: 1, color: 'white' }} />
            <Typography variant="body2">
              <strong>Interactions:</strong>{' '}
              {character.chat_messages_count || 0}
            </Typography>
          </Box>
          <Box flex={1} minWidth={150} display="flex" alignItems="center">
            <VisibilityIcon sx={{ mr: 1, color: 'white' }} />
            <Typography variant="body2">
              <strong>Visibility:</strong>{' '}
              {character.is_public ? 'Public' : 'Private'}
            </Typography>
          </Box>
          <Box flex={1} minWidth={150} display="flex" alignItems="center">
            <ShieldIcon sx={{ mr: 1, color: 'white' }} />
            <Typography variant="body2">
              <strong>Content Rating:</strong>{' '}
              {character.is_nsfw ? 'NSFW' : 'SFW'}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
