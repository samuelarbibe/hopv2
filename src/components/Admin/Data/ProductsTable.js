import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import {
  Table, Thead, Tr, Th, Tbody,
  Td, IconButton, Tag
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

const ProductsTable = ({ products, summary }) => {
  const history = useHistory()
  const { url } = useRouteMatch()

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>שם</Th>
          <Th>מחיר</Th>
          <Th>מלאי זמין</Th>
          <Th>מלאי</Th>
          {!summary && <Th></Th>}
        </Tr>
      </Thead>
      <Tbody>
        {
          products.map((product, index) => {
            return (
              <Tr key={index}>
                <Td>{product.name}</Td>
                <Td>{product.price}</Td>
                <Td>{product.tempStock}</Td>
                <Td>
                  {
                    product.stock ||
                    <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
                  }
                </Td>
                {
                  !summary &&
                  <Td p='2' isNumeric>
                    <IconButton size='sm' icon={<EditIcon />} onClick={() => history.push(`${url}/edit/${product._id}`)} />
                  </Td>
                }
              </Tr>
            )
          })
        }
      </Tbody>
    </Table>
  )
}

export default ProductsTable