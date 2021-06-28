import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChakraProvider, Container } from '@chakra-ui/react'

import { CartProvider } from './hooks/useCart'
import { AuthProvider } from './hooks/useAuth'

import Login from './components/Admin/Login'
import Admin from './components/Admin/Admin'
import Navbar from './components/Navbar'
import Products from './components/Products'
import ProductPage from './components/ProductPage'
import PrivateRoute from './components/Admin/PrivateRoute'
import CheckoutDrawer from './components/Cart/Drawer'
import theme from './theme'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CartProvider>
        <AuthProvider>
          <DndProvider backend={HTML5Backend}>
            <Navbar />
            <Container maxWidth='container.lg' height='100%' pt='64px'>
              <Switch>
                <Route path='/login'>
                  <Login />
                </Route>
                <PrivateRoute path='/admin'>
                  <Admin />
                </PrivateRoute>
                <Route path='/product/:id'>
                  <ProductPage />
                </Route>
                <Route path='/'>
                  <Products />
                </Route>
              </Switch>
            </Container>
            <CheckoutDrawer />
          </DndProvider>
        </AuthProvider>
      </CartProvider>
    </ChakraProvider>
  )
}

export default App
