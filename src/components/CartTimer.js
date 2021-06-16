import { useMemo, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import useSWR from 'swr';

export const useCartTimer = (onExpire) => {
  const { data: cart, isError } = useSWR('/api/cart')
  const [hasStarted, setHasStarted] = useState(false)

  const expireDate = useMemo(() => {
    if (!cart || isError) return null
    const cartCreationDate = new Date(cart.createdAt)
    return new Date(cartCreationDate.getTime() + 1000 * 60 * 5)
  }, [cart, isError])

  const {
    seconds,
    minutes,
    restart,
    isRunning
  } = useTimer({ expiryTimestamp: new Date(), autoStart: true, onExpire })


  if (!hasStarted && expireDate) {
    if (isRunning) setHasStarted(true)
    restart(expireDate)
  }

  const filledMinutes = minutes < 10 ? `0${minutes}` : minutes
  const filledSeconds = seconds < 10 ? `0${seconds}` : seconds
  const data = `${filledMinutes}:${filledSeconds}`

  return { data, isError }
}