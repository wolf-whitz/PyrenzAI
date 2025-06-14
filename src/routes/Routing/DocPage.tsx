import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  LayoutRenderer,
  renderDoc,
  docPath,
  Sidebar,
  MobileNav,
  PreviewHeader
} from '@components'

export function DocPage() {
  const { doc_name } = useParams()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const navigate = useNavigate()

  const isValidSlug = docPath.pages.some(page => page.slug === doc_name)
  const slug = isValidSlug ? doc_name : docPath.default

  const { meta, content } = renderDoc(slug)

  useEffect(() => {
    document.title = meta.title

    let descTag = document.querySelector('meta[name="description"]')
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.setAttribute('name', 'description')
      document.head.appendChild(descTag)
    }
    descTag.setAttribute('content', meta.description)
  }, [meta.title, meta.description])

  const handleNext = () => {
    const currentIndex = docPath.pages.findIndex(page => page.slug === slug)
    const nextIndex = (currentIndex + 1) % docPath.pages.length
    const nextSlug = docPath.pages[nextIndex].slug
    navigate(`/docs/${nextSlug}`)
  }

  const currentIndex = docPath.pages.findIndex(page => page.slug === slug)
  const nextIndex = (currentIndex + 1) % docPath.pages.length
  const nextPageTitle = docPath.pages[nextIndex].title

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <PreviewHeader setShowLogin={setShowLoginModal} setShowRegister={setShowRegisterModal} />
      </Box>

      {meta.banner && (
        <Box
          component="img"
          src={meta.banner}
          alt={`${meta.title} Banner`}
          sx={{
            width: '100%',
            height: { xs: '200px', sm: '300px', md: '300' },
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      )}

      <Box sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
      }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sidebar />
        </Box>

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileNav setShowLoginModal={setShowLoginModal} />
        </Box>

        <Box component="main" sx={{
          flexGrow: 1,
          p: 3,
          maxWidth: '900px',
          width: '100%',
          ml: { md: '10px', xs: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: { xs: '56px', md: '0' }
        }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.75rem' },
              mb: 1,
              textAlign: 'center'
            }}
          >
            {meta.title}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ textAlign: 'center' }}
          >
            {meta.description}
          </Typography>

          <LayoutRenderer meta={meta} content={content} />

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 4,
              px: 4,
              py: 2,
              width: '100%',
              maxWidth: '300px',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="button">Next</Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {nextPageTitle}
              </Typography>
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
