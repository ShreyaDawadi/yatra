import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from './useAuth'
import { savedService } from '../services/savedService'

const NO_IDS = new Set()

export function useSavedListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [savedIds, setSavedIds] = useState(() => new Set())

  useEffect(() => {
    if (!user) {
      return
    }

    let cancelled = false
    savedService
      .list()
      .then((rows) => {
        if (!cancelled) setSavedIds(new Set(rows.map((row) => row.id)))
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [user])

  const toggle = useCallback(
    async (listingId) => {
      if (!user) {
        navigate('/login', { state: { from: location.pathname + location.search } })
        return
      }

      const wasSaved = savedIds.has(listingId)

      function apply(saved) {
        setSavedIds((previous) => {
          const next = new Set(previous)
          if (saved) {
            next.add(listingId)
          } else {
            next.delete(listingId)
          }
          return next
        })
      }

      apply(!wasSaved)
      try {
        if (wasSaved) {
          await savedService.unsave(listingId)
        } else {
          await savedService.save(listingId)
        }
      } catch {
        apply(wasSaved)
      }
    },
    [user, savedIds, navigate, location],
  )

  return { savedIds: user ? savedIds : NO_IDS, toggle }
}
