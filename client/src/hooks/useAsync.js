import { useCallback, useEffect, useState } from 'react'

// Runs an async function whenever `deps` change and tracks its result.
// `deps` must be JSON-serialisable (strings, numbers, plain objects).
export function useAsync(asyncFn, deps) {
  const [reloadCount, setReloadCount] = useState(0)
  const key = JSON.stringify([deps, reloadCount])
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    let cancelled = false

    asyncFn().then(
      (data) => {
        if (!cancelled) setResult({ key, data, error: null })
      },
      (error) => {
        if (!cancelled) setResult({ key, data: null, error })
      },
    )

    return () => {
      cancelled = true
    }
    // asyncFn changes on every render; `key` captures everything it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])
  const loading = result.key !== key

  return {
    data: result.data,
    error: loading ? null : result.error,
    loading,
    reload,
  }
}
