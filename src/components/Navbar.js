import React from 'react'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useLongPress } from 'use-long-press'

import {
  IconButton, Box, Center,
  Container, Flex, Image, Menu,
  MenuButton, MenuList, MenuItem,
} from '@chakra-ui/react'
import { AiOutlineShopping } from 'react-icons/ai'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'

import { useCart } from '../hooks/useCart'

const Navbar = () => {
  const history = useHistory()
  const { pathname } = useLocation()

  const { onOpen: onOpenCart } = useCart()

  const bindLongPress = useLongPress(() => {
    history.push('/admin')
  }, { threshold: 1000, captureEvent: true, detect: 'both' })

  const adminMode = pathname.includes('admin')

  return (
    <Center position='fixed' width='100%' borderBottomWidth='1px' zIndex='999'>
      <Container maxWidth='container.lg' px='0' {...bindLongPress}>
        <Flex p='3' background='white' justifyContent='space-between'>
          <Box onClick={() => history.push('')} textAlign='center'>
            <Image alt='hop tlv' height={{ base: '40px' }} src={`${process.env.PUBLIC_URL}/hop_logo.png`} />
          </Box>
          {
            adminMode
              ? (
                <Menu placement='bottom-end' >
                  {({ isOpen }) => (
                    <>
                      <MenuButton isActive={isOpen} as={IconButton} icon={isOpen ? <CloseIcon width='10px' /> : <HamburgerIcon />} variant='ghost'>
                        {isOpen ? 'Close' : 'Open'}
                      </MenuButton>
                      <MenuList dir='rtl'>
                        <MenuItem bgColor={pathname.includes('products') ? 'gray.100' : 'white'} onClick={() => history.push('/admin/products')}>מוצרים</MenuItem>
                        <MenuItem bgColor={pathname.includes('shippingMethods') ? 'gray.100' : 'white'} onClick={() => history.push('/admin/shippingMethods')}>משלוחים</MenuItem>
                        <MenuItem bgColor={pathname.includes('carts') ? 'gray.100' : 'white'} onClick={() => history.push('/admin/carts')}>עגלות</MenuItem>
                        <MenuItem bgColor={pathname.includes('consts') ? 'gray.100' : 'white'} onClick={() => history.push('/admin/consts')}>משתני סביבה</MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
              )
              : (
                <IconButton
                  variant='ghost'
                  onClick={onOpenCart}
                  icon={<AiOutlineShopping size='1.6em' color='brand' />}
                />
              )
          }
        </Flex>
      </Container>
    </Center>
  )
}

export default Navbar