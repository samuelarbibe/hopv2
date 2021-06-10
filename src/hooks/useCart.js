import { useContext, createContext } from 'react'
import useSWR from 'swr'

const CartContext = createContext()

function CartProvider({ children }) {
  const { data: cart, isLoading, isError } = useSWR('/api/cart')

  const value = { cart, isLoading, isError }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
export { CartProvider, useCart }