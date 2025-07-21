import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Popover,
  Button,
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  ReportOutlined as ReportIcon,
} from '@mui/icons-material';
import { PyrenzBlueButton } from '~/theme';
import { Textarea } from '@components';

interface CharacterProfileProps {
  character: any;
  isLoading: any;
  userUuid: string | null;
  handleStartChat: () => void;
  handleEditCharacter: () => void;
  handleCharacterDeletion: () => void;
  handleCreatorClick: () => void;
  handleReportCharacter: (reportMessage: string, creatorUuid: string) => void;
}

export function CharacterProfile({
  character,
  isLoading,
  userUuid,
  handleStartChat,
  handleEditCharacter,
  handleCharacterDeletion,
  handleCreatorClick,
  handleReportCharacter,
}: CharacterProfileProps) {
  const isCreator = userUuid === character.creator_uuid;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportText, setReportText] = useState('');

  const handleOpenReport = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseReport = () => {
    setAnchorEl(null);
    setReportText('');
  };

  const handleSubmitReport = () => {
    handleReportCharacter(reportText, character.creator_uuid);
    handleCloseReport();
  };

  const reportPopoverOpen = Boolean(anchorEl);

  return (
    <Box component="section" flex={{ md: 1 }}>
      <Card
        sx={{
          backgroundColor: '#1E1E1E',
          color: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={character.profile_image}
          alt={character.name}
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            sx={{ fontWeight: 'bold' }}
          >
            {character.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            display="flex"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <PersonIcon sx={{ mr: 1, color: 'white' }} />
            Created by:&nbsp;
            <Typography
              component="span"
              sx={{
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'medium',
                textDecoration: 'underline',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={handleCreatorClick}
            >
              {character.creator}
            </Typography>
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {character.tags.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  backgroundColor: '#333',
                  color: 'white',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#555',
                    boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)',
                  },
                }}
              />
            ))}
          </Box>
          <PyrenzBlueButton
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              color: 'white',
              backgroundColor: '#008b8b',
              '&:hover': {
                backgroundColor: '#007777',
              },
            }}
            fullWidth
            onClick={handleStartChat}
            disabled={isLoading.startChat}
            endIcon={<ArrowForwardIcon />}
          >
            {isLoading.startChat ? 'Loading...' : 'Start Chat'}
          </PyrenzBlueButton>

          {!character.is_private && (
            <>
              <PyrenzBlueButton
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  color: 'white',
                  backgroundColor: 'warning.main',
                  '&:hover': {
                    backgroundColor: 'warning.dark',
                  },
                }}
                fullWidth
                onClick={handleOpenReport}
                startIcon={<ReportIcon />}
              >
                Report Character
              </PyrenzBlueButton>
              <Popover
                open={reportPopoverOpen}
                anchorEl={anchorEl}
                onClose={handleCloseReport}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: '#2c2c2c',
                    color: 'white',
                    width: '400px',
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Why do you want to report this character?
                  </Typography>
                  <Textarea
                    placeholder="Type your reason here..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                  />
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitReport}
                      sx={{
                        backgroundColor: 'warning.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'warning.dark',
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </>
          )}

          {isCreator && (
            <>
              <PyrenzBlueButton
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  color: 'white',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
                fullWidth
                onClick={handleEditCharacter}
                disabled={isLoading.editCharacter}
                startIcon={<EditIcon />}
              >
                {isLoading.editCharacter ? 'Loading...' : 'Edit Character'}
              </PyrenzBlueButton>
              <PyrenzBlueButton
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  color: 'white',
                  backgroundColor: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.dark',
                  },
                }}
                fullWidth
                onClick={handleCharacterDeletion}
                disabled={isLoading.deleteCharacter}
                startIcon={<DeleteIcon />}
              >
                {isLoading.deleteCharacter ? 'Loading...' : 'Delete Character'}
              </PyrenzBlueButton>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
