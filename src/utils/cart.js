import axios from 'axios'
import { mutate } from 'swr'

export const updateCart = async (productId, amount) => {
  mutate('/api/cart', (cart) => {
    let updatedItems = []
    let isProductInCart = !!cart.items.find((item) => item.productId === productId)

    if (isProductInCart) {
      updatedItems = cart.items.map((item) => {
        if (item.productId === productId) {
          const updatedItemAmount = item.amount + amount
          return { ...item, amount: updatedItemAmount }
        }
        return item
      }).filter((item) => item.amount > 0)
    } else {
      const newItem = { productId, amount }
      updatedItems = [...cart.items, newItem]
    }

    const tempUpdatedCart = { ...cart, items: updatedItems }
    return tempUpdatedCart
  }, false)

  mutate(`/api/products/${productId}`, (product) => {
    const updatedProduct = {
      ...product,
      tempStock: product.tempStock - amount
    }
    return updatedProduct
  }, false)

  try {
    const requestUrl = `/api/cart/product/${productId}?amount=${Math.abs(amount)}`
    const updateCartPormise = () => amount < 0 ? axios.delete(requestUrl) : axios.put(requestUrl)
    const { data: updatedCart } = await updateCartPormise()
    mutate('/api/cart', updatedCart, false)
    mutate(`/api/products/${productId}`)
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/cart')
  }
}

export const useEmptyCart = async () => {
  await axios.delete('/api/cart')
  mutate('/api/cart')
}

export const setShippingMethod = async (shippingMethodId) => {
  mutate('/api/cart', (cart) => {
    const tempUpdatedCart = { ...cart, shippingMethod: shippingMethodId }
    return tempUpdatedCart
  }, false)

  mutate('/api/shippingMethods', (shippingMethods) => {
    const updatedShippingMethods = shippingMethods.map((method) => {
      if (method._id !== shippingMethodId) return method
      const updatedMethod = { ...method, tempStock: method.tempStock - 1 }
      return updatedMethod
    })
    return updatedShippingMethods
  }, false)

  try {
    const { data: updatedCart } = await axios.put(`/api/cart/shippingMethod/${shippingMethodId}`)
    mutate('/api/cart', updatedCart, false)
    mutate('/api/shippingMethods')
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/shippingMethods')
    mutate('/api/cart')
  }
}
