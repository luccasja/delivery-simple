import React from 'react';
import avatar from '../../img/avatar.png'
import {useHistory} from 'react-router-dom'
import { Button, Container, Row, Col, Image} from 'react-bootstrap';

const Login = () => {

    return(
        <Container>
            <Row style={{textAlign:'center'}}>
                <Col></Col>
                <Col md='6' my-auto="true" style={{background:'#FFF', padding:40, paddingTop:50, borderRadius:8}}>
                    <Row>
                        <Col>
                            <Image src={avatar} style={{height:150, marginBottom:20, width:150}} alt='avatar' />
                        </Col>
                    </Row>
                    <Row>
                        <Col my-auto="true">
                            <p><span>Usuário</span></p>
                            <input style={{width:250, marginBottom:20}} placeholder="Seu Usuário"/>
                            <p><span>Senha</span></p>
                            <input type="password" style={{width:250,  marginBottom:20}} placeholder="Sua Senha"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button style={{background:'#FF414D', border:0, width:250, height:50, borderRadius:8 }}>Entrar</Button>
                        </Col>
                    </Row>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )

}

export default Login;
