import React, { useContext, createContext, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'

const CartContext = createContext()

function CartProvider({ children }) {
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    onClose()
  }, [location, onClose])

  const value = { isOpen, onOpen, onClose }
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