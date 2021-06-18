import React from 'react'
import { useHistory } from 'react-router'
import { useCart } from '../hooks/useCart'
import { GrShop } from 'react-icons/gr'
import { IconButton, Box, Center, Container, Flex, Image } from '@chakra-ui/react'

const Navbar = () => {
  const history = useHistory()
  const { onOpen } = useCart()

  return (
    <Center position='fixed' width='100%' boxShadow='sm' zIndex='999'>
      <Container maxWidth='container.lg' px='0'>
        <Flex p='3' background='white' justifyContent='space-between'>
          <Box onClick={() => history.push('')} textAlign='center'>
            <Image height={{ base: '40px' }} src={`${process.env.PUBLIC_URL}/hop_logo.png`} />
          </Box>
          <IconButton
            colorScheme='pink'
            variant='ghost'
            onClick={onOpen}
            icon={<GrShop size='1.4em' />}
          />
        </Flex>
      </Container>
    </Center>
  )
}

export default Navbar