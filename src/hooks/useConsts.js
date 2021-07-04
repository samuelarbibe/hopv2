import { useCallback } from 'react'
import useSWR from 'swr'

export const useConsts = () => {
  const { data: consts } = useSWR('/api/consts', { refreshInterval: 10000 })

  const getConst = useCallback((name) => {
    return consts ? consts[name] || '' : ''
  }, [consts])

  return { consts: getConst }
}