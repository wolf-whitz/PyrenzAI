import { useHomeStore, useUserStore } from '~/store'
import { useTranslation } from 'react-i18next'
import {
  getHotCharacter as GetHotCharacters,
  getLatestCharacter as GetLatestCharacters,
  getRandomCharacters as GetRandomCharacters,
  getCharacterWithTag as GetCharactersWithTags,
  useFetchCharacters,
} from '@components'
import { usePyrenzAlert } from '~/provider'
import type { Character } from '@shared-types'

export const useHomepageAPI = () => {
  const {
    search,
    setSearch,
    setCurrentPage: setStoreCurrentPage,
    setLoading,
    setCharacters,
  } = useHomeStore()
  const { t } = useTranslation()
  const itemsPerPage = 20
  const showAlert = usePyrenzAlert()
  const showNSFW = useUserStore((state) => state.show_nsfw)

  const {
    characters,
    loading,
    currentPage: fetchedCurrentPage,
    totalPages,
  } = useFetchCharacters({
    currentPage: useHomeStore.getState().currentPage,
    search,
    itemsPerPage,
    t,
    show_nsfw: showNSFW,
  })

  if (fetchedCurrentPage !== useHomeStore.getState().currentPage) {
    setStoreCurrentPage(fetchedCurrentPage)
  }

  const handleButtonClick = async (
    type: 'hot' | 'latest' | 'random' | 'tags',
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: string,
    searchQuery?: string
  ): Promise<Character[]> => {
    setLoading(true)
    try {
      let rawCharacters: Character[] = []
      switch (type) {
        case 'hot':
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required')
          }
          rawCharacters = await GetHotCharacters(type, maxCharacter, page)
          break
        case 'latest':
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required')
          }
          rawCharacters = await GetLatestCharacters(type, maxCharacter, page)
          break
        case 'random':
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required')
          }
          rawCharacters = await GetRandomCharacters(type, maxCharacter, page)
          break
        case 'tags':
          if (!tag) throw new Error('Tag is required for GetCharactersWithTags')
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required')
          }
          rawCharacters = await GetCharactersWithTags(
            maxCharacter,
            page,
            type,
            tag,
            gender,
            searchQuery
          )
          break
        default:
          throw new Error('Invalid type')
      }

      if (rawCharacters.length === 0) {
        setCharacters([])
        return []
      }

      setCharacters(rawCharacters)
      return rawCharacters
    } catch (error) {
      if (error instanceof Error) {
        showAlert(t('errors.callingRPCFunction') + ': ' + error.message, 'Alert')
      } else {
        showAlert(t('errors.unknown'), 'Alert')
      }
      setCharacters([])
      return []
    } finally {
      setLoading(false)
    }
  }

  const onButtonTagClicked = async (tag: string) => {
    await handleButtonClick('tags', itemsPerPage, fetchedCurrentPage, tag)
  }

  return {
    search,
    characters,
    loading,
    currentPage: fetchedCurrentPage,
    totalPages,
    setSearch,
    setCurrentPage: setStoreCurrentPage,
    t,
    itemsPerPage,
    handleButtonClick,
    onButtonTagClicked,
  }
}
