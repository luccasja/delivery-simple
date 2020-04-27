import React from 'react';
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/pastel.jpg'
import Add from '../../img/add.png'
import {Button, Container, Row, Col, Image} from 'react-bootstrap';

import './style.css'

export default function Pedido (){

    return(
        <Container>
            <Row style={{textAlign:'center', paddingBottom:10}}>
                <Col md='2'></Col>
                <Col md='8' style={{background:'#FFF', padding:20, borderRadius:8}}>
                    <Row>
                        <Col xs='2' >
                            <Image src={Logo} style={{height:50, width:50}} alt='logo' />
                        </Col>
                        <Col xs='8'>
                            <p className='cabecalho-titulo'><strong>Pastelaria Fina Massa</strong></p>
                            <p className='cabecalho-subtitulo'>Novo Pedido</p>
                        </Col>
                        <Col xs='2' ></Col>
                    </Row>
                    <Row>
                        <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:10, marginBottom:0}}/>
                    </Row>
                    <Row style={{margin:0}}>
                        <Col style={{padding:0,  overflow:'auto'}}>
                            <ul className="lista-produtos" style={{padding:0, width:'96%', height:400}}>
                                <li style={{listStyle:'none'}}>
                                    <Row style={{borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:5, paddingBottom:5}}>
                                        <Col xs='3' style={{padding:5}}>
                                            <Image src={Pastel} roundedCircle style={{height:50, width:50}} alt='logo' />
                                        </Col>
                                        <Col xs='5' style={{ }}>
                                            <p><strong>Pastel de Carne</strong></p>
                                            <p style={{fontSize:15}}>Carne, Cebola e Cheiro Verde</p>
                                        </Col>
                                        <Col xs='2' style={{padding:15}}>
                                            <p style={{fontSize:20}}><strong>3,00</strong></p>
                                        </Col>
                                        <Col xs='2' style={{paddingTop:18}}>
                                        <Image src={Add} roundedCircle style={{height:25, width:25}} alt='Adicionar' />
                                        </Col>
                                    </Row>
                                </li>
                                
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col/>
                        <Col md='6'>
                            <Button style={{marginTop:10, height:45}}>
                                Ir para a Cesta R$13,00
                            </Button>
                        </Col>
                        <Col/>
                    </Row>
                </Col>
                <Col md='2'></Col>
            </Row>
        </Container>
    )





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
            </ul>
            <button>Ir para a Cesta   -  R$13,50</button>
        </div>
    )
};
