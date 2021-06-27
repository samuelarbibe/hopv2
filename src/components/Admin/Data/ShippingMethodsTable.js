import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import {
  Table, Thead, Tr, Th, Tbody,
  Td, IconButton, Tag,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

import { shippingTypes } from '../Edit/EditShippingMethod'

const ShippingMethodsTable = ({ shippingMethods, summary }) => {
  const history = useHistory()
  const { url } = useRouteMatch()

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>שם</Th>
          <Th>סוג</Th>
          <Th>מחיר</Th>
          <Th>מלאי זמין</Th>
          <Th>מלאי</Th>
          <Th>תיאור</Th>
          {!summary && <Th></Th>}
        </Tr>
      </Thead>
      <Tbody>
        {
          shippingMethods.map((shippingMethod, index) => {
            return (
              <Tr key={index}>
                <Td>{shippingMethod.name}</Td>
                <Td>{shippingTypes.find((type) => type.name === shippingMethod.type)?.hebrewName}</Td>
                <Td>{shippingMethod.price}</Td>
                <Td>{shippingMethod.tempStock}</Td>
                <Td>
                  {
                    shippingMethod.stock ||
                    <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
                  }
                </Td>
                <Td>{shippingMethod.description}</Td>
                {
                  !summary &&
                  <Td p='2' isNumeric>
                    <IconButton size='sm' icon={<EditIcon />} onClick={() => history.push(`${url}/edit/${shippingMethod._id}`)} />
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

export default ShippingMethodsTable