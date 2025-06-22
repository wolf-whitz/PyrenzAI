import { Button, CircularProgress, styled } from '@mui/material';
import { keyframes } from '@mui/system';

const zoomIn = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

export const PyrenzBlueButton = styled(Button)<{
  dataState?: string;
  component?: React.ElementType;
}>({
  color: 'white',
  backgroundColor: 'black',
  transition: 'all 0.3s ease',
  borderRadius: 4,
  justifyContent: 'center',
  '&:hover': {
    animation: `${zoomIn} 0.3s ease forwards`,
    boxShadow: 'none',
    backgroundColor: '#add8e6',
    color: 'black',
  },
  '&[data-state="loading"]': {
    opacity: 0.6,
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'relative',
  },
  ...({ dataState }: { dataState?: string }) =>
    dataState === 'loading'
      ? {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        }
      : {},
});

export const PyrenzBlueButtonWithLoading = ({
  dataState,
  ...props
}: {
  dataState?: string;
  [key: string]: any;
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <PyrenzBlueButton dataState={dataState} {...props} />
      {dataState === 'loading' && (
        <CircularProgress
          size={24}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
          }}
        />
      )}
    </div>
  );
};
