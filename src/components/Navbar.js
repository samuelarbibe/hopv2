import { IconButton, Box, Center, Container, Flex, Text } from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons"
import { useHistory } from "react-router"

const Navbar = () => {
  const history = useHistory()

  return (
    <Center position='fixed' width="100%" boxShadow='sm' zIndex='999'>
      <Container maxWidth='container.lg' px='0'>
        <Flex p='3' background='white' justifyContent='space-between'>
          <Box onClick={() => history.push('')} textAlign='center'>
            <Text fontSize='x-large' fontWeight='bold'>HOP</Text>
          </Box>
          <IconButton
            onClick={() => history.push('/cart')}
            icon={<EditIcon />}
          />
        </Flex>
      </Container>
    </Center>
  )
}

export default Navbar