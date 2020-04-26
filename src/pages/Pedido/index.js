import React from 'react';
import Logo from '../../img/Logo.jpeg'
import './style.css'

export default function Pedido (){

    return(
        <div className='container-geral'>
            <div className="cabecalho">
                <img className='img-logo' src={Logo} alt='logo'/>
                <div>
                    <p className='cabecalho-titulo'><strong>Pastelaria Fina Massa</strong></p>
                    <p className='cabecalho-subtitulo'>Novo Pedido</p>
                </div>
                <div/>
            </div>
            <div className='separador'/>
            <ul className="lista-produtos">
                <li>
                    <div className='container-item'>
                        <div className='container-img-produto'>
                            <img className='img-produto' src={Logo} alt='produto'/>
                        </div>
                        <div className='container-descricao'>
                            <p><strong>Pastel de Carne</strong></p>
                            <p>Carne, Cebola e Cheiro Verde</p>
                        </div>
                        <div className='container-valor'>
                            <p><strong>R$ 3,00</strong></p>
                        </div>
                    </div>
                    <div className='separador-item'/>
                </li>
                <li>
                    <div className='container-item'>
                        <div className='container-img-produto'>
                            <img className='img-produto' src={Logo} alt='produto'/>
                        </div>
                        <div className='container-descricao'>
                            <p><strong>Pastel de Carne</strong></p>
                            <p>Carne, Cebola e Cheiro Verde</p>
                        </div>
                        <div className='container-valor'>
                            <p><strong>R$ 3,00</strong></p>
                        </div>
                    </div>
                    <div className='separador-item'/>
                </li>
                <li>
                    <div className='container-item'>
                        <div className='container-img-produto'>
                            <img className='img-produto' src={Logo} alt='produto'/>
                        </div>
                        <div className='container-descricao'>
                            <p><strong>Pastel de Carne</strong></p>
                            <p>Carne, Cebola e Cheiro Verde</p>
                        </div>
                        <div className='container-valor'>
                            <p><strong>R$ 3,00</strong></p>
                        </div>
                    </div>
                    <div className='separador-item'/>
                </li>
                <li>
                    <div className='container-item'>
                        <div className='container-img-produto'>
                            <img className='img-produto' src={Logo} alt='produto'/>
                        </div>
                        <div className='container-descricao'>
                            <p><strong>Pastel de Carne</strong></p>
                            <p>Carne, Cebola e Cheiro Verde</p>
                        </div>
                        <div className='container-valor'>
                            <p><strong>R$ 3,00</strong></p>
                        </div>
                    </div>
                    <div className='separador-item'/>
                </li>
            </ul>
            <button>Ir para a Cesta   -  R$13,50</button>
        </div>
    )
};
