import axios from 'axios'
import { mutate } from 'swr'

export const updateShippingMethod = async (shippingMethodToUpdate) => {
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
    return shippingMethodToUpdate._id
  } catch (err) {
    console.log('Error!!!')
    mutate(`/api/shippingMethods/${shippingMethodToUpdate._id}`)
    return null
  }
}

export const addShippingMethod = async (shippingMethodToAdd) => {
  try {
    const { data: insertedShippingMethod } = await axios.post('/api/shippingMethods', shippingMethodToAdd)
    mutate(`/api/shippingMethods/${insertedShippingMethod._id}`, insertedShippingMethod, false)
    mutate('/api/shippingMethods', (prev) => [...prev, insertedShippingMethod], false)
    return insertedShippingMethod._id
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/shippingMethods')
    return null
  }
}

export const deleteShippingMethod = async (shippingMethodId) => {
  try {
    const { data: deletedShippingMethod } = await axios.delete(`/api/shippingMethods/${shippingMethodId}`)
    mutate('/api/shippingMethods', (prev) => prev.filter((shippingMethod) => shippingMethod._id !== deletedShippingMethod._id), false)
    return deletedShippingMethod._id
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/shippingMethods')
    return null
  }
}