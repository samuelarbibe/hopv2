/* eslint-disable react/display-name */
import React, { useMemo } from 'react'
import useSWR from 'swr'

import { useTable, useFilters, useGroupBy, useExpanded, useFlexLayout } from 'react-table'
import { Table, Tag, Tbody, Td, Text, Th, Thead, Tr, VStack, Box, Flex } from '@chakra-ui/react'

import OrdersTableToolbar from './OrdersTableToolbar'

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


const classes = {
  table: {
    border: '1px',
    padding: '1px',
    borderColor: 'grey.100',
  },
  th: {
    textAlign: 'center',
    borderBottom: '1px',
    borderRight: '1px',
    borderColor: 'grey.100',
    _first: {
      borderRight: 0,
    }
  },
  td: {
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    justifyContent: 'center',
  }
}

const useItemColumns = (productIds) => {
  const { data: products } = useSWR('/api/products/all')
  const relevantProducts = useMemo(() => products?.filter((product) => productIds.includes(product._id)) || [], [products, productIds])

  const columns = useMemo(() => relevantProducts.map((product) => ({
    id: product._id,
    Header: product.name,
    name: product.name,
    accessor: (row) => {
      return row.cart?.items.find((item) => item.productId === product._id)?.amount
    },
    aggregate: 'sum',
  }), []), [relevantProducts])

  return columns
}

const useColumns = (productIds) => {
  const itemColumns = useItemColumns(productIds)
  const columns = useMemo(() => [{
    id: 'id',
    Header: 'מספר הזמנה',
    name: 'מספר הזמנה',
    accessor: '_id',
    width: '250',
    disableGroupBy: true,
  },
  {
    id: 'status',
    Header: 'סטטוס',
    name: 'סטטוס',
    width: '100',
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
      return value ? <Tag varian='subtle' colorScheme={colorScheme}>{text}</Tag> : null
    }
  },
  {
    id: 'asmachta',
    Header: 'מספר אסמכתא',
    name: 'מספר אסמכתא',
    width: '130',
    accessor: 'transaction.asmachta',
    disableGroupBy: true,
  },
  {
    id: 'paymentDate',
    Header: 'תאריך',
    name: 'תאריך',
    width: '110',
    accessor: 'transaction.paymentDate',
    disableFilters: true,
  },
  {
    id: 'customerDetails',
    Header: 'פרטי לקוח',
    name: 'פרטי לקוח',
    columns: [
      {
        id: 'customerName',
        Header: 'שם מלא',
        name: 'שם לקוח',
        accessor: 'cart.customerDetails.fullName',
      },
      {
        id: 'customerPhoneNumber',
        Header: 'טלפון',
        name: 'טלפון לקוח',
        accessor: 'cart.customerDetails.phoneNumber',
      },
      {
        id: 'customerEmail',
        Header: 'אימייל',
        name: 'אימייל לקוח',
        width: '200',
        accessor: 'cart.customerDetails.email',
      },
      {
        id: 'customerAddress',
        Header: 'כתובת',
        name: 'כתובת לקוח',
        accessor: 'cart.customerDetails',
        disableGroupBy: true,
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
    id: 'shippingDetails',
    Header: 'פרטי משלוח',
    columns: [
      {
        id: 'shippingType',
        Header: 'סוג',
        name: 'סוג משלוח',
        width: '120',
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
          return value ? <Tag varian='subtle' colorScheme={colorScheme}>{text}</Tag> : null
        }
      },
      {
        id: 'shippingPrice',
        Header: 'מחיר',
        name: 'מחיר משלוח',
        width: '100',
        accessor: 'cart.shippingMethod.price',
        Cell: ({ value }) => `${Number(value).toFixed(2)} ₪`,
        disableFilters: true,
        disableGroupBy: true,
      },
    ]
  },
  {
    id: 'items',
    Header: 'פריטים',
    name: 'פריטים',
    columns: itemColumns
  },
  {
    id: 'sum',
    Header: 'סה"כ',
    name: 'סה"כ',
    width: '100',
    accessor: 'transaction.sum',
    Cell: ({ value }) => <Text whiteSpace='nowrap'>{value ? `${Number(value).toFixed(2)} ₪` : ''}</Text>,
    aggregate: 'sum',
    disableFilters: true,
    disableGroupBy: true,
  }
  ], [itemColumns])

  const defaultHiddenColumns = useMemo(() => ['id', 'asmachta', 'itemPrice', 'shippingPrice'], [])
  const defaultFilters = useMemo(() => [
    {
      id: 'status',
      value: 'approved'
    }
  ], [])
  return { columns, defaultHiddenColumns, defaultFilters }
}

const OrdersTable = ({ orders }) => {
  const productIdsInOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const updatedAcc = [...acc]
      order?.cart?.items.forEach((item) => {
        const { productId } = item
        if (acc.indexOf(productId) === -1) updatedAcc.push(productId)
      })
      return updatedAcc
    }, [])
  }, [orders])

  const { columns, defaultHiddenColumns, defaultFilters } = useColumns(productIdsInOrders)

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const tableInstance = useTable(
    {
      columns,
      data: orders,
      defaultColumn,
      initialState: {
        hiddenColumns: defaultHiddenColumns,
        filters: defaultFilters
      }
    },
    useFilters,
    useGroupBy,
    useExpanded,
    useFlexLayout,
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    <VStack spacing='5' alignItems='stretch' p='10' paddingX={{ 'base': 0, 'md': 10 }}>
      <Box paddingX={{ 'base': 5, 'md': 0 }} >
        <OrdersTableToolbar tableInstance={tableInstance} />
      </Box>
      <Box overflowX='auto'>
        <Table {...getTableProps()} variant='striped' size='sm' sx={classes.table} >
          <Thead overflowY='auto' overflowX='hidden'>
            {
              headerGroups.map((headerGroup, index) => (
                <Tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map((column, index) => (
                      <Th key={index} {...column.getHeaderProps()} sx={classes.th}>
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
          <Tbody {...getTableBodyProps()} overflowY='scroll' overflowX='hidden' height='600px' display='block'>
            {
              rows.map((row, index) => {
                prepareRow(row)
                return (
                  <Tr key={index} {...row.getRowProps()}>
                    {
                      row.cells.map((cell, index) => {
                        return (
                          <Td key={index} {...cell.getCellProps()} sx={classes.td}>
                            {
                              cell.isGrouped ? (
                                <Flex alignItems='center'>
                                  <span {...row.getToggleRowExpandedProps()}>
                                    {row.isExpanded ? '👇' : '👈'}
                                  </span>{' '}
                                  {cell.render('Cell')} ({row.subRows.length})
                                </Flex>
                              ) : cell.isAggregated ? (
                                cell.render('Aggregated')
                              ) : cell.isPlaceholder ? null : (
                                cell.render('Cell')
                              )
                            }
                          </Td>
                        )
                      })}
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  )
}

export default OrdersTable