import './index.css'
import '@fontsource/alef'
import '@fontsource/inter'
import '@fontsource/raleway'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import theme from './theme'
import SWRWrapper from './hooks/SWRWrapper'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <SWRWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SWRWrapper>
    </ChakraProvider >
  </React.StrictMode>,
  document.getElementById('root')
)