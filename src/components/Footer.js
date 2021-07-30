import React from 'react'
import { Box, Container, Link, Text } from '@chakra-ui/layout'
import { AiOutlineInstagram } from 'react-icons/ai'
import { Button, IconButton } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box w='100%' position='absolute' bottom='0' left='0' p='5'>
      <Container maxWidth='container.lg' display='flex' justifyContent='space-between' alignItems='center'>
        <Button as={Link} borderRadius='3xl' size='sm' variant='ghost' fontWeight='light' href='https://api.whatsapp.com/send?phone=972546323734' target='_blank'>צור קשר</Button>
        <Text fontSize='12' fontWeight='thin' pr='10'>© HoP 2021</Text>
        <IconButton as={Link} textDecoration='none' borderRadius='3xl' size='sm' variant='ghost' href='https://www.instagram.com/hoptlv/' target='_blank'><AiOutlineInstagram /></IconButton>
      </Container>
    </Box>
  )
}

export default Footer