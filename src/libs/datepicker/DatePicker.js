/// Credit: https://gist.github.com/igoro00/99e9d244677ccafbf39667c24b5b35ed

import React from 'react'
import ReactDatePicker from 'react-datepicker'
import { useColorMode } from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import './date-picker.css'

const DatePicker = ({ selectedDate, onChange, isClearable = false, showPopperArrow = false, ...props }) => {
  const isLight = useColorMode().colorMode === 'light'

  return (
    <div className={isLight ? 'light-theme' : 'dark-theme'} dir='ltr'>
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        className="react-datapicker__input-text"
        {...props}
      />
    </div>
  )
}

export default DatePicker