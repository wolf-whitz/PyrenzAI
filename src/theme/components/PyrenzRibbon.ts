import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

interface StyledRibbonProps extends BoxProps {
  color?: string;
}

export const PyrenzRibbon = styled(Box)<StyledRibbonProps>(({ color }) => ({
  position: 'absolute',
  width: 100,
  height: 24,
  backgroundColor: color,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'rotate(45deg) translate(30%, -30%)',
  transformOrigin: 'top right',
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
}));

 