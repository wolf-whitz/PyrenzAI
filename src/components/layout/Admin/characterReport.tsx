import { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface CharacterReportType {
  report_content: string;
  char_uuid: string;
  user_uuid: string;
  creator_uuid: string;
}

interface Props {
  reports: CharacterReportType[];
  onBanCharacter: (char_uuid: string) => void;
  onUnbanCharacter: (char_uuid: string) => void;
  onBanUser: (user_uuid: string) => void;
  onUnbanUser: (user_uuid: string) => void;
}

export function CharacterReport({
  reports,
  onBanCharacter,
  onUnbanCharacter,
  onBanUser,
  onUnbanUser,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return reports.filter(
      (report) =>
        report.report_content.toLowerCase().includes(term) ||
        report.char_uuid.toLowerCase().includes(term) ||
        report.user_uuid.toLowerCase().includes(term) ||
        report.creator_uuid.toLowerCase().includes(term)
    );
  }, [searchTerm, reports]);

  return (
    <Box>
      <TextField
        label="Search reports"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          sx: {
            backgroundColor: '#000',
            color: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#555',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#888',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
            '& input': {
              color: '#fff',
            },
          },
        }}
        InputLabelProps={{
          sx: {
            color: '#aaa',
            '&.Mui-focused': {
              color: '#fff',
            },
          },
        }}
      />
      {filteredReports.map((report, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid #333',
            borderRadius: 2,
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Report
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {report.report_content}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#bbb' }}
          >
            Character UUID: <strong>{report.char_uuid}</strong>
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#bbb' }}
          >
            User UUID: <strong>{report.user_uuid}</strong>
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#bbb' }}
          >
            Creator UUID: <strong>{report.creator_uuid}</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<BlockIcon />}
              sx={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                '&:hover': { backgroundColor: '#b71c1c' },
              }}
              onClick={() => onBanCharacter(report.char_uuid)}
            >
              Ban Character
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              sx={{
                backgroundColor: '#388e3c',
                color: '#fff',
                '&:hover': { backgroundColor: '#2e7d32' },
              }}
              onClick={() => onUnbanCharacter(report.char_uuid)}
            >
              Unban Character
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonOffIcon />}
              sx={{
                borderColor: '#ff9800',
                color: '#ff9800',
                '&:hover': {
                  borderColor: '#ffa726',
                  backgroundColor: 'rgba(255, 152, 0, 0.08)',
                },
              }}
              onClick={() => onBanUser(report.user_uuid)}
            >
              Ban User
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': { backgroundColor: '#1565c0' },
              }}
              onClick={() => onUnbanUser(report.user_uuid)}
            >
              Unban User
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
