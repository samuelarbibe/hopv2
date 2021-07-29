import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { Box, ChakraProvider, Container, Link, Text } from '@chakra-ui/react'
import { isMobile } from 'react-device-detect'

import { CartProvider } from './hooks/useCart'
import { AuthProvider } from './hooks/useAuth'

import Login from './components/Admin/Login'
import Admin from './components/Admin/Admin'
import Navbar from './components/Navbar'
import Products from './components/Products'
import ProductPage from './components/ProductPage'
import CheckoutDrawer from './components/Cart/Drawer'
import PrivateRoute from './components/Admin/PrivateRoute'
import CheckoutStepper from './components/Checkout/CheckoutStepper'
import theme from './theme'
import { AiOutlineInstagram } from 'react-icons/ai'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CartProvider>
        <AuthProvider>
          <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <Navbar />
            <Container maxWidth='container.lg' py='64px'>
              <Switch>
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
            <Box w='100%' position='absolute' bottom='0' left='0' p='5'>
              <Container maxWidth='container.lg' display='flex' justifyContent='space-between' alignItems='center'>
                <Link href='https://api.whatsapp.com/send?phone=972546323734' target='_blank' fontWeight='light'>צור קשר</Link>
                <Text fontSize='12' fontWeight='thin' pr='10'>© HoP 2021</Text>
                <Link href='https://www.instagram.com/hoptlv/' target='_blank'><AiOutlineInstagram /></Link>
              </Container>
            </Box>
            <CheckoutDrawer />
          </DndProvider>
        </AuthProvider>
      </CartProvider>
    </ChakraProvider >
  )
}

export default App
