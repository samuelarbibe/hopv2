import { useContext, useState } from "react"
import useSWR from "swr"

import { useParams } from "react-router"
import { Add, Subtract } from "grommet-icons"
import { Box, Button, Paragraph, ResponsiveContext, Spinner, Text } from "grommet"

const ProductPage = () => {
  const { id } = useParams()
  const { data: loadedProducts } = useSWR('/api/products', {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  })
  const { data: product, isError } = useSWR(`/api/products/${id}`, {
    initialData: loadedProducts?.find((product) => product._id === id),
    revalidateOnMount: true,
  })

  const size = useContext(ResponsiveContext)
  const largeSizeDevice = size !== 'small'

  const [tempAmount, setTempAmount] = useState(1)

  if (isError) return (
    <Box align='center'>
      <Text>Could not load product</Text>
    </Box>
  )

  if (!product) return (
    <Box style={{ position: 'absolute', top: '50%', left: '45%' }}>
      <Spinner size='medium' />
    </Box>
  )

  const handleClickAdd = () => {
    console.log('Added to cart!')
  }

  return (
    <Box
      pad='medium'
      gap='medium'
      round='small'
      width='large'
      height='medium'
      flex={largeSizeDevice ? 'shrink' : 'grow'}
      direction={largeSizeDevice ? 'row' : 'column'}
    >
      <Box
        round='small'
        overflow='hidden'
        flex='grow'
        basis={largeSizeDevice ? '1/2' : '1'}
        background={`url(${product.images[0]})`}
      />
      <Box>
        <Box pad={largeSizeDevice ? 'small' : 'medium'}>
          <Text margin={{ bottom: 'small' }} size={largeSizeDevice ? 'large' : 'medium'} weight='bold'>{product.name}</Text>
          <Paragraph alignSelf='end' margin='xsmall' dir='rtl'>{product.description}</Paragraph>
        </Box>
        <Box flex='grow' />
        <Box pad='medium' justify='between' align='center' direction='row'>
          {
            product.tempStock
              ? (
                <Box direction='row'>
                  <Button disabled={tempAmount === product.tempStock} secondary fill={false} icon={<Add />} onClick={() => setTempAmount(tempAmount + 1)} />
                  <Text alignSelf='center' size='large' margin={{ horizontal: 'small' }}>{tempAmount}</Text>
                  <Button disabled={tempAmount === 0} secondary fill={false} icon={<Subtract />} onClick={() => setTempAmount(tempAmount - 1)} />
                </Box>
              )
              : <Text color='red'>אין במלאי</Text>
          }
          <Box direction='row'>
            <Text alignSelf='center' weight='bold' size='large'>
              {tempAmount * product.price}
            </Text>
            <Text alignSelf='center' weight='bold' size='xlarge' margin={{ horizontal: 'xxsmall' }}>
              ₪
          </Text>
          </Box>
        </Box>
        <Box
          animation={{
            type: 'fadeIn',
            duration: 300,
          }}
        >
          <Button
            primary
            size='large'
            label='הוסף לעגלה'
            onClick={handleClickAdd}
            disabled={tempAmount === 0 || product.tempStock === 0}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ProductPage