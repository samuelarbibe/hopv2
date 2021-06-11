import { Route, Switch } from "react-router-dom"
import { Box, Grommet } from "grommet"

import Cart from "./components/Cart"
import Navbar from "./components/Navbar"
import Products from "./components/Products"
import ProductPage from "./components/ProductPage"
import theme from "./theme"

function App() {
  return (
    <Grommet theme={theme} style={{ minHeight: '100%', paddingTop: '60px', display: 'flex', justifyContent: 'center' }}>
      <Navbar />
      <Box width={{ max: 'xlarge', width: '100%' }}>
        <Switch>
          <Route path='/cart'>
            <Cart />
          </Route>
          <Route path='/product/:id'>
            <ProductPage />
          </Route>
          <Route path='/'>
            <Products />
          </Route>
        </Switch>
      </Box>
    </Grommet>
  )
}

export default App
