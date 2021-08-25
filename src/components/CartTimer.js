import { useMemo, useEffect } from 'react'
import useSWR from 'swr'

import { useTimer } from 'react-timer-hook'

export const useCartTimer = (onExpire) => {
  const { data: cart, isError } = useSWR('/api/cart')
  const { seconds, minutes, restart } = useTimer({ onExpire, expiryTimestamp: new Date() })

  useEffect(() => {
    if (cart?.expiresAt) {
      restart(new Date(cart?.expiresAt))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.expiresAt])

  const filledMinutes = useMemo(() => minutes < 10 ? `0${minutes}` : minutes, [minutes])
  const filledSeconds = useMemo(() => seconds < 10 ? `0${seconds}` : seconds, [seconds])
  const data = useMemo(() => `${filledMinutes}:${filledSeconds}`, [filledMinutes, filledSeconds])

  return { data, isError }
}