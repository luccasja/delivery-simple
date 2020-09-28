import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {ToastProvider} from 'react-toast-notifications'
import HttpsRedirect from 'react-https-redirect';
import Home from './pages/Home'
import Login from './pages/Login'
import Pedido from './pages/Pedido'
import PedidoPublic from './pages/PedidoPublic'
import Finalizar from './pages/Finalizar'
import Dashboard from './pages/Dashboard'

export default function Routes() {
    
    return(
        <HttpsRedirect>
            <ToastProvider>
                <BrowserRouter>
                    <Switch>
                        <Route path='/' exact component={Home} />
                        <Route path='/login' component={Login} />
                        <Route path='/pedido' component={Pedido} />
                        <Route path='/pb/:id' component={PedidoPublic} />
                        <Route path='/finalizar' component={Finalizar} />
                        <Route path='/dashboard' component={Dashboard} />
                    </Switch>
                </BrowserRouter>
            </ToastProvider>
        </HttpsRedirect>
    )
}