import React, {useEffect, useState} from 'react';
import avatar from '../../img/avatar.png'
import {useHistory} from 'react-router-dom'
import { Button, Container, Row, Col, Image} from 'react-bootstrap'
import api from '../../services/api'


const Login = () => {

    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    //const [erroVisible, setErroVisible] = useState(false)
    const history = useHistory()
    
    useEffect(()=>{
        let islogged = localStorage.getItem('@delivery/islogged')
        if(islogged === 'true'){
            history.replace('/dashboard')
        }
    },[])

    async function Logar(){
        if(Validacao()){
            const auth = {user,pass}
            try {
                await api.post('/usuario/auth', auth).then((resultado)=>{
                    console.log(resultado.data)
                    if(resultado.data.autenticado){
                        localStorage.setItem('@delivery/islogged', 'true')
                        history.replace('/dashboard')
                    }
                })
            } catch (error) {
                //setErroVisible(true)
            }
        }
    }

    function Validacao(){
        if(user === ""){
            alert('O campo de usuario não pode ser vazio')
            return false
        }

        if(pass === ""){
            alert('O campo de senha não pode ser vazio')
            return false
        }

        return true
    }

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
                            <input onChange={(e)=>setUser(e.target.value)} style={{width:250, marginBottom:20}} placeholder="Seu Usuário"/>
                            <p><span>Senha</span></p>
                            <input onChange={(e)=>setPass(e.target.value)} type="password" style={{width:250,  marginBottom:20}} placeholder="Sua Senha"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
                            <Button onClick={Logar} style={{background:'#FF414D', border:0, width:250, height:50, borderRadius:8 }}>Entrar</Button>
                        </Col>
                    </Row>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )

}

export default Login;
