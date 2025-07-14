import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  OutlinedInput as MuiOutlinedInput,
  styled,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PyrenzFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#add8e6',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    '&.Mui-focused': {
      color: '#add8e6',
    },
  },
});

export const PyrenzOutlinedInput = styled(MuiOutlinedInput)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
    borderWidth: '1px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#add8e6',
    borderWidth: '1px',
  },
});

export const PyrenzInputLabel = styled(InputLabel)({
  color: 'white',
  '&.Mui-focused': {
    color: '#add8e6',
  },
});

export function PyrenzAccordionInput({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`${label}-content`}
        id={`${label}-header`}
      >
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
