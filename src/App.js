import React from 'react'
import useSWR from 'swr'
import { DndProvider } from 'react-dnd'
import { isMobile } from 'react-device-detect'
import { Route, Switch } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import { Container } from '@chakra-ui/react'

import { CartProvider } from './hooks/useCart'
import { AuthProvider } from './hooks/useAuth'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Admin from './components/Admin/Admin'
import Login from './components/Admin/Login'
import Products from './components/Products'
import ThankYou from './components/ThankYou'
import ProductPage from './components/ProductPage'
import CheckoutDrawer from './components/Cart/Drawer'
import PrivateRoute from './components/Admin/PrivateRoute'
import CheckoutStepper from './components/Checkout/CheckoutStepper'

function App() {
  useSWR('/api/cart', { refreshInterval: 5000 })

  return (
    <CartProvider>
      <AuthProvider>
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
          <Navbar />
          <Container maxWidth='container.lg' py='64px'>
            <Switch>
              <Route path='/thankYou'>
                <ThankYou />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/checkout'>
                <CheckoutStepper />
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
          <Footer />
          <CheckoutDrawer />
        </DndProvider>
      </AuthProvider>
    </CartProvider>
  )
}

export default App
