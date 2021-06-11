import { useContext, useState } from "react"
import useSWR, { mutate } from "swr"

import { useParams } from "react-router"
import { Add, Subtract } from "grommet-icons"
import { Box, Button, Carousel, Image, Paragraph, ResponsiveContext, Spinner, Text } from "grommet"
import { updateCart } from "../utils/cart"

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

  const handleClickAdd = async () => {
    try {
      await updateCart(id, tempAmount)
      mutate(`/api/products/${id}`)
      setTempAmount(1)
    } catch (err) {
      console.log('Failed to update cart')
    }
  }

  return (
    <Box
      pad='medium'
      gap='medium'
      height='500px'
      flex={largeSizeDevice ? 'shrink' : 'grow'}
      direction={largeSizeDevice ? 'row' : 'column'}
    >
      <Box
        flex
        round='small'
      >
        <Carousel fill play={product.images.length > 1 ? 5000 : 0} initialChild={product.images.length - 1}>
          {
            product.images.map((url) => {
              return <Image key={url} src={url} fit='cover' />
            }).reverse()
          }
        </Carousel>
      </Box>
      <Box flex={largeSizeDevice}>
        <Box pad={largeSizeDevice ? 'small' : 'medium'}>
          <Text color='dark-1' margin={{ bottom: 'small' }} size={largeSizeDevice ? 'large' : 'medium'} weight='bold'>{product.name}</Text>
          <Paragraph color='dark-2' size={largeSizeDevice ? 'large' : 'medium'} alignSelf='end' margin='xsmall' dir='rtl'>{product.description}</Paragraph>
        </Box>
        <Box flex='grow' />
        <Box pad='medium' justify='between' align='center' direction='row'>
          {
            product.tempStock
              ? (
                <Box direction='row'>
                  <Button disabled={tempAmount === product.tempStock} secondary fill={false} icon={<Add />} onClick={() => setTempAmount(tempAmount + 1)} />
                  <Text color='dark-1' alignSelf='center' size='large' margin={{ horizontal: 'small' }}>{tempAmount}</Text>
                  <Button disabled={tempAmount === 0} secondary fill={false} icon={<Subtract />} onClick={() => setTempAmount(tempAmount - 1)} />
                </Box>
              )
              : <Text color='red'>אין במלאי</Text>
          }
          <Box direction='row'>
            <Text color='dark-1' alignSelf='center' weight='bold' size='large'>
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
    </Box >
  )
}

export default ProductPage