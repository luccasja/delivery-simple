import React, {useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import Logo from '../../img/Logo.jpeg'
import { Container, Row, Col, Image, Button, Modal, Spinner, Navbar} from 'react-bootstrap';
import Api from '../../services/api'

const Dashboard = () =>{

    return(
        <div style={{margin:0, padding:0}}>
            <Navbar style={{background:'#F97A7A'}}>
            <Navbar.Brand style={{color:'#FFF', textAlign:'center'}}>Fina Massa</Navbar.Brand>
            </Navbar>
            <Row style={{width:'100%'}}>
                <Col md='3' style={{background:'#FFF', textAlign:'center'}}>
                    <Row style={{marginTop:20, paddingBottom:20, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3'}}>
                        <Col>
                            <Image src={Logo} style={{height:50, width:50}} alt='logo' />
                            <p><strong>Fina Massa</strong></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding:0}}>
                            <Button style={{width:'100%', borderRadius:0, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3', background:'#fff', borderColor:'#FFF'}}><p>Perfil</p></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding:0}}>
                            <Button style={{width:'100%', borderRadius:0, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3', background:'#fff', borderColor:'#FFF'}}><p>Pedidos</p></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding:0}}>
                            <Button style={{width:'100%', borderRadius:0, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3', background:'#fff', borderColor:'#FFF'}}><p>Produtos</p></Button>
                        </Col>
                    </Row>
                </Col>
                <Col md='1' style={{background:'#F5f5f5'}}>
                </Col>
                <Col md='7' style={{background:'#FFF'}}>
                t
                </Col>
                <Col md='1' style={{background:'#F5f5f5'}}>
                </Col>
            </Row>
        </div>
        
    )

}

export default Dashboard