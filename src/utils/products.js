import axios from 'axios'
import { mutate } from 'swr'

export const updateProduct = async (productToUpdate) => {
  mutate('/api/products', (products) => {
    return products.map((product) => {
      return product._id === productToUpdate._id
        ? productToUpdate
        : product
    })
  }, false)

  mutate(`/api/products/${productToUpdate._id}`, productToUpdate, false)

  try {
    const { data: updatedProduct } = await axios.put('/api/products', productToUpdate)
    mutate(`/api/products/${productToUpdate._id}`, updatedProduct, false)
    return true
  } catch (err) {
    console.log('Error!!!')
    mutate(`/api/products/${productToUpdate._id}`)
    return false
  }
}
