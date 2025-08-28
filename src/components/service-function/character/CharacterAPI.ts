import { useState, useEffect } from 'react'
import { GetUserUUID, fetchCharacters } from '@components'
import { Utils } from '~/utility'
import { usePyrenzAlert } from '~/provider'
import type { Character } from '@shared-types'

export const useCharacterData = (char_uuid: string | undefined) => {
  const [character, setCharacter] = useState<Character | null>(null)
  const [recommendedCharacters, setRecommendedCharacters] = useState<Character[]>([])
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const showAlert = usePyrenzAlert()

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!char_uuid) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        const { characters, recommendedCharacters } = await fetchCharacters({
          currentPage: 1,
          itemsPerPage: 1,
          sortBy: 'chat_messages_count',
          filterCharUUID: char_uuid,
          showRecommended: true,
        })

        const foundCharacter = characters?.[0] ?? null

        if (foundCharacter) {
          setCharacter(foundCharacter)
          setRecommendedCharacters(recommendedCharacters ?? [])
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('💥 Error fetching character:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacterData()
  }, [char_uuid])

  const handleDeleteCharacter = async (): Promise<boolean> => {
    if (!char_uuid) return false

    try {
      const user_uuid = await GetUserUUID()
      if (!user_uuid) return false

      const result = await Utils.db.rpc<boolean>({
        func: 'delete_character',
        params: {
          in_char_uuid: char_uuid,
          in_creator_uuid: user_uuid,
        },
      })

      if (result === true) {
        showAlert('Character deleted successfully', 'success')
        return true
      } else {
        showAlert('Character could not be deleted', 'error')
        return false
      }
    } catch (err) {
      console.error('🚫 Failed to delete character via RPC:', err)
      showAlert('Error deleting character', 'error')
      return false
    }
  }

  const handleReportCharacter = async (
    reportText: string,
    creator_uuid: string
  ): Promise<boolean> => {
    if (!char_uuid) return false

    try {
      const user_uuid = await GetUserUUID()
      if (!user_uuid) return false

      const reportData = {
        user_uuid,
        char_uuid,
        creator_uuid,
        report_content: reportText,
      }

      const result = await Utils.db.insert({
        tables: 'character_reports',
        data: reportData,
        options: {
          onConflict: ['user_uuid', 'char_uuid'],
        },
      })

      if (result.length > 0) {
        showAlert('Your report has been submitted.', 'success')
        return true
      }

      showAlert('Could not submit report.', 'error')
      return false
    } catch (err) {
      console.error('Failed to report character:', err)
      showAlert('An error occurred while reporting.', 'error')
      return false
    }
  }

  return {
    character,
    recommendedCharacters,
    notFound,
    loading,
    handleDeleteCharacter,
    handleReportCharacter,
  }
}
