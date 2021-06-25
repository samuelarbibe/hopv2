import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Data from './Data/Data'
import EditProduct from './Edit/EditProduct'

const Admin = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path}>
        <Data />
      </Route>
      <Route path={`${path}/edit/product/:id`}>
        <EditProduct />
      </Route>
      <Route path={`${path}/edit/shippingMethod/:id`}>
        <Data />
      </Route>
    </Switch>
  )
}

export default Admin