import { useState, useEffect, useCallback } from 'react'
import { Character } from '@shared-types'
import { Box, Typography, Fade } from '@mui/material'
import {
  ChatBubbleOutlineRounded as ChatIcon,
  PublicRounded as PublicIcon,
  LockRounded as LockIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  PyrenzCharacterCard,
  PyrenzCharacterCardContent,
  PyrenzCharacterCardImage,
  PyrenzCharacterCardTitle,
  PyrenzCharacterCardDescription,
  PyrenzCharacterCardTags,
  PyrenzCharacterCardTag,
  PyrenzCharacterCardImageImg,
  PyrenzAltTag,
  PyrenzRibbon,
} from '~/theme'

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleCardClick = useCallback(() => {
    navigate(`/character/${character.char_uuid}`)
  }, [character.char_uuid, navigate])

  const handleCreatorClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      navigate(`/profile/${character.creator_uuid}`)
    },
    [character.creator_uuid, navigate]
  )

  if (character.isLoading) return null

  return (
    <Fade in={isLoaded} timeout={1500}>
      <PyrenzCharacterCard onClick={handleCardClick}>
        <PyrenzCharacterCardImage style={{ position: 'relative' }}>
          {character.is_nsfw && (
            <PyrenzRibbon
              color="red"
              style={{
                position: 'absolute',
                top: '30px',
                right: '6px',
              }}
            >
              NSFW
            </PyrenzRibbon>
          )}
          <PyrenzCharacterCardImageImg
            src={character.profile_image}
            alt={character.name}
            className={character.is_nsfw ? 'nsfw' : ''}
          />
        </PyrenzCharacterCardImage>
        <PyrenzCharacterCardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={1}
          >
            <Box display="flex" flexDirection="column">
              <PyrenzCharacterCardTitle>
                {character.name}
              </PyrenzCharacterCardTitle>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={handleCreatorClick}
              >
                <PyrenzAltTag>@{character.creator}</PyrenzAltTag>
              </Box>
            </Box>
            <Box
              display={{ xs: 'none', md: 'flex' }}
              alignItems="center"
              gap={0.5}
            >
              <ChatIcon fontSize="small" sx={{ color: '#e2e8f0' }} />
              <Typography
                variant="caption"
                sx={{ color: '#e2e8f0', fontWeight: 500 }}
              >
                {character.chat_messages_count}
              </Typography>
            </Box>
          </Box>
          <PyrenzCharacterCardDescription>
            {character.description?.length > 120
              ? `${character.description.substring(0, 120)}...`
              : character.description || 'No description available.'}
          </PyrenzCharacterCardDescription>
          <PyrenzCharacterCardTags>
            <PyrenzCharacterCardTag>
              {character.is_public ? (
                <>
                  <PublicIcon fontSize="small" style={{ marginRight: 4 }} />
                  Public
                </>
              ) : (
                <>
                  <LockIcon fontSize="small" style={{ marginRight: 4 }} />
                  Private
                </>
              )}
            </PyrenzCharacterCardTag>
            {(character.tags ?? []).map((tag, index) => (
              <PyrenzCharacterCardTag key={index}>{tag}</PyrenzCharacterCardTag>
            ))}
          </PyrenzCharacterCardTags>
        </PyrenzCharacterCardContent>
      </PyrenzCharacterCard>
    </Fade>
  )
}
