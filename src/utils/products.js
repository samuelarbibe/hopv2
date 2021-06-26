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
    return productToUpdate._id
  } catch (err) {
    console.log('Error!!!')
    mutate(`/api/products/${productToUpdate._id}`)
    return null
  }
}

export const addProduct = async (productToAdd) => {
  try {
    const { data: insertedProduct } = await axios.post('/api/products', productToAdd)
    mutate(`/api/products/${insertedProduct._id}`, insertedProduct, false)
    mutate('/api/products', (prev) => [...prev, insertedProduct], false)
    return insertedProduct._id
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/products')
    return null
  }
}

export const deleteProduct = async (productId) => {
  try {
    const { data: deletedProduct } = await axios.delete(`/api/products/${productId}`)
    mutate('/api/products', (prev) => prev.filter((product) => product._id !== deletedProduct._id), false)
    return deletedProduct._id
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/products')
    return null
  }
}
