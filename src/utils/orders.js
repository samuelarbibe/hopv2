import axios from 'axios'

export const cancelOrder = async () => {
  try {
    await axios.delete('/api/orders/cancelOrder')
    return true
  } catch (err) {
    console.log('Error!!!')
    return false
  }
}
