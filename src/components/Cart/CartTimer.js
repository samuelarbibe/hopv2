import { useEffect } from 'react'
import useSWR from 'swr'

import { useTimer } from 'react-timer-hook'

export const useCartTimer = (onExpire) => {
  const { data: cart, isError } = useSWR('/api/cart')
  const { seconds, minutes, restart } = useTimer({ expiryTimestamp: new Date(), autoStart: true, onExpire })

  useEffect(() => {
    const expireDate = new Date(cart?.expiresAt)
    restart(expireDate)
  }, [cart?.expiresAt])

  const filledMinutes = minutes < 10 ? `0${minutes}` : minutes
  const filledSeconds = seconds < 10 ? `0${seconds}` : seconds
  const data = `${filledMinutes}:${filledSeconds}`

  return { data, isError }
}