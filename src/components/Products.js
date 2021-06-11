import { useContext } from "react"
import { useHistory } from "react-router"
import useSWR from "swr"

import { Box, Main, Paragraph, ResponsiveContext, Spinner, Text } from "grommet"

const Products = () => {
  const history = useHistory()
  const { data: products, isError } = useSWR('/api/products')

  const size = useContext(ResponsiveContext)
  const largeSizeDevice = size !== 'small'

  if (isError) return (
    <Box height='large' align='center'>
      <Text>Could not load products</Text>
    </Box>
  )

  if (!products) return (
    <Box style={{ position: 'absolute', top: '50%', left: '45%' }}>
      <Spinner size='medium' />
    </Box>
  )

  return (
    <Main
      pad='medium'
      wrap
      justify='center'
      direction={largeSizeDevice ? 'row' : 'column'}
      alignContent={largeSizeDevice ? 'start' : 'stretch'}
    >
      {
        products
          .sort((product) => product.tempStock)
          .map((product, index) => {
            return (
              <Box
                key={product._id}
                direction='column'
                animation={largeSizeDevice ? {
                  type: 'fadeIn',
                  delay: (index + 1) * 100
                } : {}}
                gap='small'
                pad='small'
                onClick={() => history.push(`product/${product._id}`)}
                width={largeSizeDevice ? '33%' : {}}
                height='500px'
                margin={{ vertical: 'small' }}
              >
                <Box
                  flex
                  round='xsmall'
                  overflow='hidden'
                  background={`url(${product.images[0]})`}
                />
                <Box height={{ min: '130px' }} justify='between' pad={largeSizeDevice ? 'xsmall' : 'medium'}>
                  <Box>
                    <Text color='dark-1' weight='bold'>{product.name}</Text>
                    <Paragraph color='dark-2' alignSelf='end' margin='xsmall' dir='rtl'>{product.description}</Paragraph>
                  </Box>
                  <Box direction='row' justify='between' align='center'>
                    <Text size='large' alignSelf='center'>{product.price} ₪</Text>
                    {
                      product.tempStock === 0 &&
                      <Text color='red'>אין במלאי</Text>
                    }
                  </Box>
                </Box>
              </Box>
            )
          })
      }
    </Main >
  )
}

export default Products