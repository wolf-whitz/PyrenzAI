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
import { useRef, useEffect } from 'react'

export const useHomepageAPI = () => {
  const {
    search,
    setSearch,
    setCurrentPage: setStoreCurrentPage,
    setLoading,
    setCharacters,
    setMaxPage,
  } = useHomeStore()
  const { t } = useTranslation()
  const itemsPerPage = 20
  const showAlert = usePyrenzAlert()
  const showNSFW = useUserStore((s) => s.show_nsfw)

  const usedCustomButton = useRef(false)

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

  useEffect(() => {
    if (!usedCustomButton.current && fetchedCurrentPage !== useHomeStore.getState().currentPage) {
      setStoreCurrentPage(fetchedCurrentPage)
    }
  }, [fetchedCurrentPage])

  const handleButtonClick = async (
    type: 'hot' | 'latest' | 'random' | 'tags',
    maxCharacter?: number,
    page: number = 1,
    tag?: string,
    gender?: string,
    searchQuery?: string
  ): Promise<Character[]> => {
    usedCustomButton.current = true
    setStoreCurrentPage(page)
    setLoading(true)

    try {
      let result:
        | Awaited<ReturnType<typeof GetHotCharacters>>
        | Awaited<ReturnType<typeof GetLatestCharacters>>
        | Awaited<ReturnType<typeof GetRandomCharacters>>
        | Awaited<ReturnType<typeof GetCharactersWithTags>>

      switch (type) {
        case 'hot':
          if (maxCharacter === undefined) throw new Error('Missing data')
          result = await GetHotCharacters('hot', maxCharacter, page)
          break
        case 'latest':
          if (maxCharacter === undefined) throw new Error('Missing data')
          result = await GetLatestCharacters('latest', maxCharacter, page)
          break
        case 'random':
          if (maxCharacter === undefined) throw new Error('Missing data')
          result = await GetRandomCharacters('random', maxCharacter, page)
          break
        case 'tags':
          if (!tag || maxCharacter === undefined) throw new Error('Missing tag or data')
          result = await GetCharactersWithTags({
            maxCharacter,
            page,
            tag,
            gender,
            searchQuery,
          })
          break
        default:
          throw new Error('Invalid type')
      }

      if (result.characters.length === 0) {
        setCharacters([])
        setMaxPage(1)
        return []
      }

      setCharacters(result.characters)
      setMaxPage(result.totalPages)
      return result.characters
    } catch (error) {
      if (error instanceof Error) {
        showAlert(t('errors.callingRPCFunction') + ': ' + error.message, 'Alert')
      } else {
        showAlert(t('errors.unknown'), 'Alert')
      }
      setCharacters([])
      setMaxPage(1)
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
    setCurrentPage: (page: number) => {
      usedCustomButton.current = false
      setStoreCurrentPage(page)
    },
    t,
    itemsPerPage,
    handleButtonClick,
    onButtonTagClicked,
  }
}
