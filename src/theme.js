import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        color: 'gray.600',
      }
    },
  },
  colors: {
    brand: {
      100: '#1A202C',
      200: '#1A202C',
      300: '#1A202C',
      400: '#1A202C',
      500: '#1A202C',
      600: '#1A202C',
      700: '#1A202C',
      800: '#1A202C',
      900: '#1A202C',
    }
  },
  fonts: {
    heading: 'Inter, Alef',
    body: 'Raleway, Alef',
  },
})
export default theme