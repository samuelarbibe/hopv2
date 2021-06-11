import axios from 'axios'
import { mutate } from 'swr'

export const updateCart = async (productId, amount) => {
  const requestUrl = `/api/cart/${productId}?amount=${Math.abs(amount)}`
  const updateCartPormise = () => amount < 0 ? axios.delete(requestUrl) : axios.put(requestUrl)

  const { data } = await updateCartPormise()
  mutate('/api/cart', data)
}

export const emptyCart = async () => {
  await axios.delete('/api/cart')
  mutate('/api/cart')
}
