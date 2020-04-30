import React from 'react';
import ReactDOM from 'react-dom';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css'
import Routes from './routes';


ReactDOM.render(<Routes/>,document.getElementById('root'));