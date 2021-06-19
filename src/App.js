import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ChakraProvider, Container } from '@chakra-ui/react'

import Navbar from './components/Navbar'
import Products from './components/Products'
import ProductPage from './components/ProductPage'
import { CartProvider } from './hooks/useCart'
import { AuthProvider } from './hooks/useAuth'
import CheckoutDrawer from './components/Drawer'
import Login from './components/Login'

function App() {
  return (
    <ChakraProvider>
      <CartProvider>
        <AuthProvider>
          <Navbar />
          <Container maxWidth='container.lg' height='100%' pt='64px'>
            <Switch>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/product/:id'>
                <ProductPage />
              </Route>
              <Route path='/'>
                <Products />
              </Route>
            </Switch>
          </Container>
          <CheckoutDrawer />
        </AuthProvider>
      </CartProvider>
    </ChakraProvider>
  )
}

export default App
