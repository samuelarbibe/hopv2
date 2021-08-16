/* eslint-disable react/display-name */
import { Table, Tag, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTable, useFilters, useGroupBy, useExpanded } from 'react-table'

const DefaultColumnFilter = ({
  column: { filterValue, setFilter },
}) => {

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder='חפש'
    />
  )
}

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}


const OrdersTable = ({ orders }) => {
  const columns = useMemo(() => [
    {
      Header: 'מספר הזמנה',
      accessor: '_id',
    },
    {
      Header: 'סטטוס',
      accessor: 'status',
      Filter: SelectColumnFilter,
      Cell: function statusCell({ value }) {
        let colorScheme = 'blackAlpha'
        let text = value
        switch (value) {
          case 'approved':
            colorScheme = 'green'
            text = 'מאושר'
            break
          case 'cancelled':
            colorScheme = 'red'
            text = 'מבוטל'
            break
        }
        return <Tag varian='subtle' colorScheme={colorScheme}>{text}</Tag>
      }
    },
    {
      Header: 'מספר אסמכתא',
      accessor: 'transaction.asmachta',
    },
    {
      Header: 'תאריך',
      accessor: 'transaction.paymentDate',
      disableFilters: true,
    },
    {
      Header: 'פרטי לקוח',
      columns: [
        {
          Header: 'שם מלא',
          accessor: 'cart.customerDetails.fullName',
        },
        {
          Header: 'טלפון',
          accessor: 'cart.customerDetails.phoneNumber',
        },
        {
          Header: 'אימייל',
          accessor: 'cart.customerDetails.email',
        },
        {
          Header: 'כתובת',
          accessor: 'cart.customerDetails',
          Cell: ({ value }) => {
            return (
              <>
                <Text>{value?.address}</Text>
                {
                  value?.houseNumber &&
                  <Text> דירה {value?.houseNumber}</Text>
                }
              </>
            )
          }
        },
      ]
    },
    {
      Header: 'פרטי משלוח',
      columns: [
        {
          Header: 'סוג',
          accessor: 'cart.shippingMethod.type',
          Filter: SelectColumnFilter,
          Cell: ({ value }) => {
            let colorScheme = 'blackAlpha'
            let text = value
            switch (value) {
              case 'delivery':
                colorScheme = 'blue'
                text = 'משלוח'
                break
              case 'pickup':
                colorScheme = 'yellow'
                text = 'איסוף עצמי'
                break
            }
            return <Tag varian='subtle' colorScheme={colorScheme}>{text}</Tag>
          }
        },
        {
          Header: 'מחיר',
          accessor: 'cart.shippingMethod.price',
          Cell: ({ value }) => `${Number(value).toFixed(2)} ₪`,
          disableFilters: true,
        },
      ]
    },
    {
      Header: 'פריטים',
      columns: [
        {
          Header: 'שם',
          id: 'item_name',
          accessor: 'cart.items',
          Cell: ({ value: items }) => items?.map((item) => item.productName)
        },
        {
          Header: 'כמות',
          id: 'item_amount',
          accessor: 'cart.items',
          Cell: ({ value: items }) => items?.map((item) => item.amount),
          disableFilters: true,
        },
        {
          Header: 'מחיר',
          id: 'item_price',
          accessor: 'cart.items',
          Cell: ({ value: items }) => items?.map((item) => `${Number(item.amount * item.productPrice).toFixed(2)} ₪`),
          disableFilters: true,
        },
      ]
    },
    {
      Header: 'מחיר',
      accessor: 'transaction.sum',
      Cell: ({ value }) => <Text whiteSpace='nowrap'>{value ? `${Number(value).toFixed(2)} ₪` : ''}</Text>,
      disableFilters: true,
    },
  ], [])

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: orders,
      defaultColumn
    },
    useFilters,
    useGroupBy,
    useExpanded
  )

  return (
    <Table {...getTableProps()} variant='striped' size='sm'>
      <Thead>
        {
          headerGroups.map((headerGroup, index) => (
            <Tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column, index) => (
                  <Th textAlign='center' border='1px' borderColor='grey.200' key={index} {...column.getHeaderProps()}>
                    {column.render('Header')}
                    {column.canGroupBy ? (
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? '🛑 ' : '👊 '}
                      </span>
                    ) : null}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </Th>
                ))}
            </Tr>
          ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {
          rows.map((row, index) => {
            prepareRow(row)
            return (
              <Tr key={index} {...row.getRowProps()}>
                {
                  row.cells.map((cell, index) => {
                    return (
                      <Td key={index} px='3' {...cell.getCellProps()}>
                        {
                          cell.render('Cell')}
                      </Td>
                    )
                  })}
              </Tr>
            )
          })}
      </Tbody>
    </Table>
  )
}

export default OrdersTable