import { Box, Center, Container } from '@chakra-ui/layout'
import { Fade } from '@chakra-ui/react'
import React, { useRef } from 'react'
import useOnScreen from '../hooks/useOnScreen'

const BottomNavbarHoc = ({ children }) => {
  const ref = useRef()
  const isVisible = useOnScreen(ref, { threshold: 1.0, rootMargin: '0px 0px -16px 0px' })

  return (
    <>
      <Box ref={ref} visibility={isVisible ? 'visible' : 'hidden'}>
        {children}
      </Box>
      {
        !isVisible &&
        <Fade in={!isVisible}>
          <Center position='fixed' bottom='0' left='0' width='100%' borderTopWidth='1px' zIndex='999' p='4' bg='white'>
            <Container maxWidth='container.lg' px='0'>
              {children}
            </Container>
          </Center>
        </Fade>
      }
    </>
  )
}

export default BottomNavbarHoc