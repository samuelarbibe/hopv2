import React from 'react'
import './index.css'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

import SWRWrapper from './hooks/SWRWrapper'

ReactDOM.render(
  <React.StrictMode>
    <SWRWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SWRWrapper>
  </React.StrictMode>,
  document.getElementById('root')
)