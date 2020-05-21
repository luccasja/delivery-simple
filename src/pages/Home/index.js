import React, {useEffect, useState} from 'react'
import './style.css'
import Logo from '../../img/Logo.jpeg'
import login from '../../img/login.png'
import {useHistory} from 'react-router-dom'
import { Button, Container, Row, Col, Image} from 'react-bootstrap';
import Api from '../../services/api'

const Home = () => {
    const history = useHistory()
    const [btnNovoPedidoVisible, setBtnNovoPedidoVisible] = useState(false)

    useEffect(()=>{
        Api.get('session').then(response=>{
            if(response.status === 200){
                if(response.data){
                    setBtnNovoPedidoVisible(true)
                }
            }
        })
    },[])


    function handleNovoPedido(){
        history.push('/pedido')
    }

    function handleLogin(){
        history.push('/login')
    }

    return(
        <Container>
            <Row style={{textAlign:'center'}}>
                <Col/>
                <Col md='8' style={{background:'#FFF', padding:40, paddingTop:15, borderRadius:8}}>
                    <Row>
                        <Button style={{background:'#FFF', width:50, height:40, borderColor:'#e3e3e3'}} onClick={handleLogin}>
                            <p><span><Image src={login} style={{height:20, width:20}} alt='logo' /></span></p>
                        </Button>
                    </Row>
                    <Image src={Logo} style={{height:150, marginBottom:20, width:150}} alt='logo' />
                    <Row hidden={!btnNovoPedidoVisible} style={{textAlign:'center', background:'#FCFCFC', padding:20, marginBottom:40, borderRadius:8, borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                        <Col>
                            <p className='saudacao-txt' style={{marginBottom:15, fontSize:20}}>Olá, seja bem-vindo(a) ao <strong>Fina Massa</strong></p>
                            <p>Sinta-se a vontade e faça o seu pedido!</p>
                        </Col>
                    </Row>
                    <Row hidden={btnNovoPedidoVisible} style={{textAlign:'center', background:'#FCFCFC', padding:20, marginBottom:40, borderRadius:8, borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                        <Col>
                            <p className='saudacao-txt' style={{marginBottom:15, fontSize:20}}>Olá, seja bem-vindo(a) ao <strong>Fina Massa</strong></p>
                            <p style={{fontSize:20}} ><strong>Horário de Funcionamento</strong></p>
                            <p>Segunda a Quinta das 16:00 às 20:00</p>
                            <p>Sexta, Domingo e Feriados das 16:00 às 22:00</p>
                        </Col>
                    </Row>
                    <Button hidden={!btnNovoPedidoVisible} style={{background:'#FF414D', border:0, width:250, height:50, borderRadius:8 }} onClick={handleNovoPedido}>Novo Pedido</Button>
                </Col>
                <Col/>
            </Row>
        </Container>
    )
};

export default Home;

