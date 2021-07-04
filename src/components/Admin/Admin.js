import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Consts from './Consts'
import Data from './Data/Data'
import EditProduct from './Edit/EditProduct'
import EditShippingMethod from './Edit/EditShippingMethod'
import Products from './Products'
import ShippingMethods from './ShippingMethods'

const Admin = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path}>
        <Data />
      </Route>
      <Route path={`${path}/products`} exact>
        <Products />
      </Route>
      <Route path={`${path}/products/edit/:id`}>
        <EditProduct />
      </Route>
      <Route path={`${path}/shippingMethods`} exact>
        <ShippingMethods />
      </Route>
      <Route path={`${path}/shippingMethods/edit/:id`}>
        <EditShippingMethod />
      </Route>
      <Route path={`${path}/consts`} exact>
        <Consts />
      </Route>
    </Switch>
  )
}

export default Admin