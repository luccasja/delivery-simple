import React from 'react'
import './style.css'
import Logo from '../../img/Logo.jpeg'
import {useHistory} from 'react-router-dom'

const Home = () => {
    const history = useHistory()

    function handleNovoPedido(){
        history.push('/pedido')
    }

    return(
        <div className='container-geral'>
            <img src={Logo} alt='logo'/>
            <div className='info'>
                <div className='saudacao'>
                    <p className='saudacao-txt'>Olá, seja bem-vindo(a) ao <strong>Fina Massa</strong></p>
                    
                    <p style={{fontSize:20}} ><strong>Horário de Funcionamento</strong></p>
                    <p>Segunda a Quinta das 16:00 às 20:00</p>
                    <p>Sexta, Domingo e Feriados das 16:00 às 22:00</p>
                </div>
            </div>
            <button onClick={handleNovoPedido}>Novo Pedido</button>
        </div>
    )
};

export default Home;

