import { Anchor, Box, Header, Text } from "grommet"
import { Shop } from "grommet-icons"
import { useHistory } from "react-router"

const Navbar = () => {
  const history = useHistory()

  return (
    <Header background='white' style={{ position: 'fixed', top: 0 }} height='60px' width='100%' pad='small' justify='between' gap='medium'>
      <Box pad='medium' onClick={() => history.push('')}>
        <Text size='xlarge' weight='bold'>HOP</Text>
      </Box>
      <Anchor
        onClick={() => history.push('/cart')}
        icon={<Shop />}
      />
    </Header>
  )
}

export default Navbar