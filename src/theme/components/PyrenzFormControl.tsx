import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  OutlinedInput as MuiOutlinedInput,
  Select,
  MenuItem,
  SelectProps,
  styled,
  Typography,
  MenuItemProps,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const glassyBg = 'rgba(255, 255, 255, 0.06)';
const border = '1px solid rgba(255, 255, 255, 0.15)';
const textColor = '#e0e0e0';
const accentColor = '#b0d0ff';

export const PyrenzFormControl = styled(FormControl)({
  backdropFilter: 'blur(8px)',
  borderRadius: '8px',
  padding: '6px 10px',
  border,
  minWidth: 100,
  width: '100%',

  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    color: textColor,
    backgroundColor: 'transparent',

    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
  },

  '& .MuiInputLabel-root': {
    color: textColor,
    '&.Mui-focused': {
      color: accentColor,
    },
  },
});

export const PyrenzOutlinedInput = styled(MuiOutlinedInput)({
  borderRadius: '6px',
  color: textColor,
  fontSize: '0.875rem',
  padding: '6px 10px',
  backgroundColor: 'transparent',

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
});

export const PyrenzInputLabel = styled(InputLabel)({
  color: textColor,
  fontSize: '0.75rem',
  '&.Mui-focused': {
    color: accentColor,
  },
});

export const PyrenzSelect = styled((props: SelectProps) => (
  <Select
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: glassyBg,
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border,
          color: textColor,
          mt: 0.5,
          p: 0.5,
        },
      },
      MenuListProps: {
        sx: {
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          px: 0.5,
        },
      },
    }}
    input={<PyrenzOutlinedInput />}
    {...props}
  />
))({
  '& .MuiSelect-select': {
    padding: '6px 10px',
    fontSize: '0.875rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  '& svg': {
    color: textColor,
  },
});

export const PyrenzMenuItem = styled((props: MenuItemProps) => (
  <MenuItem {...props} />
))({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  color: textColor,

  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
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
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        background: glassyBg,
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border,
        color: textColor,
        transition: 'all 0.2s ease',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: textColor }} />}
        aria-controls={`${label}-content`}
        id={`${label}-header`}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.875rem',
            color: textColor,
          }}
        >
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '12px',
          backgroundColor: 'transparent',
          borderTop: border,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
