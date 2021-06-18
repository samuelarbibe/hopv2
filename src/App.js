import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ChakraProvider, Container } from '@chakra-ui/react'

import Navbar from './components/Navbar'
import Products from './components/Products'
import ProductPage from './components/ProductPage'
import { CartProvider } from './hooks/useCart'
import CheckoutDrawer from './components/Drawer'

function App() {
  return (
    <ChakraProvider>
      <CartProvider>
        <Navbar />
        <Container maxWidth='container.lg' height='100%' pt='64px'>
          <Switch>
            <Route path='/product/:id'>
              <ProductPage />
            </Route>
            <Route path='/'>
              <Products />
            </Route>
          </Switch>
        </Container>
        <CheckoutDrawer />
      </CartProvider>
    </ChakraProvider>
  )
}

export default App
