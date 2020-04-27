import React from 'react'
import './style.css'
import Logo from '../../img/Logo.jpeg'
import {useHistory} from 'react-router-dom'
import { Button, Container, Row, Col, Image} from 'react-bootstrap';

const Home = () => {
    const history = useHistory()

    function handleNovoPedido(){
        history.push('/pedido')
    }

    return(
        <Container>
            <Row style={{textAlign:'center'}}>
                <Col/>
                <Col md="auto" style={{background:'#FFF', padding:40, borderRadius:8}}>
                    <Image src={Logo} style={{height:150, marginBottom:20, width:150}} alt='logo' />
                    <Row style={{textAlign:'center', background:'#FCFCFC', padding:20, marginBottom:40, borderRadius:8, borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                        <Col>
                            <p className='saudacao-txt' style={{marginBottom:15, fontSize:20}}>Olá, seja bem-vindo(a) ao <strong>Fina Massa</strong></p>
                            <p style={{fontSize:20}} ><strong>Horário de Funcionamento</strong></p>
                            <p>Segunda a Quinta das 16:00 às 20:00</p>
                            <p>Sexta, Domingo e Feriados das 16:00 às 22:00</p>
                        </Col>
                    </Row>
                    <Button style={{background:'#FF414D', border:0, width:200, borderRadius:8 }} onClick={handleNovoPedido}>Novo Pedido</Button>
                </Col>
                <Col/>
            </Row>
        </Container>
    )
};

export default Home;

