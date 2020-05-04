import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Pedido from './pages/Pedido'
import Finalizar from './pages/Finalizar'
import Dashboard from './pages/Dashboard'

export default function Routes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact={true} component={Home} />
                <Route path='/login' component={Login} />
                <Route path='/pedido' component={Pedido} />
                <Route path='/finalizar' component={Finalizar} />
                <Route path='/dashboard' component={Dashboard} />
            </Switch>
        </BrowserRouter>
    )
}