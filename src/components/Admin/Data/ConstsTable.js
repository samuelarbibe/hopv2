import React from 'react'

import {
  Table, Thead, Tr, Th, Tbody,
  Td, EditablePreview, Editable, EditableInput, useToast
} from '@chakra-ui/react'
import { updateConst } from '../../../utils/consts'

const ConstsTable = ({ consts }) => {
  const toast = useToast()

  const onSubmit = async (key, value) => {
    if (consts[key] === value) return

    const success = await updateConst(key, value)
    if (success) {
      toast({
        title: 'משתנה סביבה עודכן בהצלחה',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'אירעה שגיאה בעדכון משתנה הסביבה',
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>שם</Th>
          <Th>ערך</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          Object.keys(consts).map((key, index) => {
            const value = consts[key]
            return (
              <Tr key={index}>
                <Td>{key}</Td>
                <Td>
                  <Editable defaultValue={value} onSubmit={(nextValue) => onSubmit(key, nextValue)}>
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Td>
              </Tr>
            )
          })
        }
      </Tbody>
    </Table>
  )
}

export default ConstsTable