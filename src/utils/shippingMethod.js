import axios from 'axios'
import { mutate } from 'swr'

export const updatedShippingMethod = async (shippingMethodToUpdate) => {
  mutate('/api/shippingMethods', (shippingMethods) => {
    return shippingMethods.map((shippingMethod) => {
      return shippingMethod._id === shippingMethodToUpdate._id
        ? shippingMethodToUpdate
        : shippingMethod
    })
  }, false)

  mutate(`/api/shippingMethods/${shippingMethodToUpdate._id}`, shippingMethodToUpdate, false)

  try {
    const { data: updatedshippingMethod } = await axios.put('/api/shippingMethods', shippingMethodToUpdate)
    mutate(`/api/shippingMethods/${shippingMethodToUpdate._id}`, updatedshippingMethod, false)
    return true
  } catch (err) {
    console.log('Error!!!')
    mutate(`/api/shippingMethods/${shippingMethodToUpdate._id}`)
    return false
  }
}
