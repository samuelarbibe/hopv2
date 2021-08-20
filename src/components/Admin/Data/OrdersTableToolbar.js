import React from 'react'

import { HStack } from '@chakra-ui/layout'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'

const OrdersTableToolbar = ({ tableInstance }) => {
  const {
    allColumns,
  } = tableInstance

  const visibleCount = allColumns.reduce((acc, column) => acc += column.isVisible ? 1 : 0, 0)

  return (
    <HStack>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          הראה/הסתר עמודות
        </MenuButton>
        <MenuList>
          {
            allColumns.map((column, index) => {
              const isDisabled = visibleCount === 1 && column.isVisible
              return (
                <MenuItem isDisabled={isDisabled} key={index} onClick={() => column.toggleHidden(column.isVisible)} closeOnSelect={false}>
                  <HStack alignItems='center'>
                    <Checkbox isDisabled={isDisabled} isChecked={column.isVisible} pointerEvents='none' />
                    <Text>{column.name}</Text>
                  </HStack>
                </MenuItem>
              )
            })
          }
        </MenuList>
      </Menu>
    </HStack>
  )
}

export default OrdersTableToolbar