import { FormControl, InputLabel, OutlinedInput as MuiOutlinedInput, styled } from '@mui/material';

export const PyrenzFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#add8e6',
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: '#add8e6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#add8e6',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#add8e6',
    '&.Mui-focused': {
      color: '#add8e6',
    },
  },
});

export const PyrenzOutlinedInput = styled(MuiOutlinedInput)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#add8e6',
    transition: 'border-color 0.3s ease',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#add8e6',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#add8e6',
    borderWidth: '2px',
  },
});

export const PyrenzInputLabel = styled(InputLabel)({
  color: '#add8e6',
  '&.Mui-focused': {
    color: '#add8e6',
  },
});
