import { useCallback, useEffect } from 'react'
import { fetchCharacters } from '@components'
import { usePyrenzAlert } from '~/provider'
import type { Character } from '@shared-types'
import { useHomeStore } from '~/store'

interface UseFetchCharactersProps {
  currentPage: number
  search: string
  itemsPerPage: number
  t: (key: string) => string
  show_nsfw: boolean
}

export function useFetchCharacters({
  currentPage,
  search,
  itemsPerPage,
  t,
  show_nsfw,
}: UseFetchCharactersProps) {
  const showAlert = usePyrenzAlert()
  const {
    loading,
    setLoading,
    characters,
    setCharacters,
    maxPage,
    setMaxPage,
    currentPage: currentPageFromStore, 
  } = useHomeStore()

  const fetchCharactersData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetchCharacters({
        currentPage,
        itemsPerPage,
        search: search || '',
        showNsfw: show_nsfw,
      })

      const safeCharacters = response.characters.map((char: Character) => char)
      setCharacters(safeCharacters)

      const newMaxPage = Math.ceil(response.totalItems / itemsPerPage) || 1
      setMaxPage(newMaxPage)
    } catch (error) {
      showAlert(t('errors.fetchingCharacters'), 'Alert')
      setCharacters([])
      setMaxPage(1)
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    search,
    itemsPerPage,
    t,
    setLoading,
    setCharacters,
    setMaxPage,
    show_nsfw,
  ])

  useEffect(() => {
    fetchCharactersData()
  }, [fetchCharactersData])

  const isLoadingMaxPage = loading || maxPage === 0 || maxPage == null

  return {
    characters,
    loading: isLoadingMaxPage,
    totalPages: maxPage || 1,
    currentPage: currentPageFromStore || 1,
  }
}
