import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Pedido from './pages/Pedido'

export default function Routes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact={true} component={Home} />
                <Route path='/pedido' component={Pedido} />
            </Switch>
        </BrowserRouter>
    )
}