import React, { useState } from 'react'
import {
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  MenuItem,
  SxProps,
  Theme,
  Box,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/material/styles'
import { PyrenzRibbon, PyrenzDialog, PyrenzCard, PyrenzMenu } from '~/theme'

const StyledCardImage = styled('div')({
  width: '135px',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const StyledCardContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '18px 16px',
  overflow: 'hidden',
})

const StyledCardName = styled(Typography)({
  fontSize: '1.3rem',
  fontWeight: 700,
  marginBottom: '12px',
  color: '#ffffff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

interface PyrenzChatsCharacterCardProps {
  imageSrc: string
  characterName: string
  children?: React.ReactNode
  ChatSend?: (event: React.MouseEvent<HTMLDivElement>) => void
  onDeleteClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onPinClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  isPinned?: boolean
}

export function PyrenzChatsCharacterCard({
  imageSrc,
  characterName,
  children,
  ChatSend,
  onDeleteClick,
  onPinClick,
  style,
  sx,
  isPinned = false,
}: PyrenzChatsCharacterCardProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [confirmPinOpen, setConfirmPinOpen] = useState(false)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  const handleDelete = () => {
    setConfirmDeleteOpen(true)
    handleClose()
  }

  const handlePin = () => {
    setConfirmPinOpen(true)
    handleClose()
  }

  const confirmDelete = () => {
    setConfirmDeleteOpen(false)
    if (onDeleteClick) {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.MouseEvent<HTMLButtonElement>
      onDeleteClick(fakeEvent)
    }
  }

  const confirmPin = () => {
    setConfirmPinOpen(false)
    if (onPinClick) {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.MouseEvent<HTMLButtonElement>
      onPinClick(fakeEvent)
    }
  }

  return (
    <>
      <PyrenzCard
        style={style}
        sx={{
          ...sx,
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          maxWidth: '440px',
          height: '250px',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <StyledCardImage>
          <StyledImage src={imageSrc} alt="Preview" />
          {isPinned && <PyrenzRibbon color="red">Pinned</PyrenzRibbon>}
        </StyledCardImage>

        <StyledCardContent>
          <Box>
            <StyledCardName>{characterName}</StyledCardName>
            <Typography
              variant="body2"
              sx={{
                color: '#cbd5e1',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.5,
                fontSize: '0.9rem',
              }}
            >
              {children}
            </Typography>
          </Box>
        </StyledCardContent>

        <IconButton
          aria-label="more"
          onClick={handleMenuClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'inherit',
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <PyrenzMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={(e) => {
              handleClose()
              ChatSend?.(e as unknown as React.MouseEvent<HTMLDivElement>)
            }}
          >
            Chat Now
          </MenuItem>
          <MenuItem onClick={handlePin}>
            {isPinned ? 'Unpin Chat' : 'Pin Chat'}
          </MenuItem>
          <MenuItem onClick={handleDelete}>Delete Chat</MenuItem>
        </PyrenzMenu>
      </PyrenzCard>

      <PyrenzDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete Chat?"
        content="This will permanently remove the chat history. This action is irreversible."
        onConfirm={confirmDelete}
      />

      <PyrenzDialog
        open={confirmPinOpen}
        onClose={() => setConfirmPinOpen(false)}
        title={isPinned ? 'Unpin Chat?' : 'Pin Chat?'}
        content={
          isPinned
            ? 'This chat will be unpinned from your archive.'
            : 'This chat will be pinned to the top of your archive for quick access.'
        }
        onConfirm={confirmPin}
      />
    </>
  )
}
