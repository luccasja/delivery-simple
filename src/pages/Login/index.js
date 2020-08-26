import React, {useEffect, useState, useRef} from 'react';
import avatar from '../../img/avatar.png'
import {useHistory} from 'react-router-dom'
import { Button, Row, Col, Image, Alert} from 'react-bootstrap'
import api from '../../services/api'


const Login = () => {

    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [erroVisible, setErroVisible] = useState(false)
    const [btnLogarDisable, setBtnLogarDisable] = useState(false)
    const history = useHistory()
    const btnLogar = useRef()
    const inputPass = useRef()
    
    useEffect(()=>{
        let islogged = localStorage.getItem('@delivery/islogged')
        if(islogged === 'true'){
            history.replace('/dashboard')
        }
    },[])

    async function Logar(){
        if(Validacao()){
            const auth = {user, pass}
            try {
                await api.post('/usuario/auth', auth).then((resultado)=>{
                    console.log(resultado.data)
                    if(resultado.data.autenticado){
                        localStorage.setItem('@delivery/islogged', 'true')
                        history.replace('/dashboard')
                    }
                })
            } catch (error) {
                setErroVisible(true)
                setPass("")
                inputPass.current.textContent = ""
                inputPass.current.focus()
                btnLogar.current.blur()
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
        <div>
            <Row style={{textAlign:'center', margin:0, padding:0}}>
                <Col></Col>
                <Col md='4' style={{background:'#FFF', padding:40, paddingTop:50, borderRadius:8}}>
                    <Row style={{margin:0, padding:0}}>
                        <Col>
                            <Image src={avatar} style={{height:150, marginBottom:20, width:150}} alt='avatar' />
                        </Col>
                    </Row>
                    <Row style={{margin:0, padding:0}}>
                        <Col style={{margin:0, padding:0}}>
                            <label>
                                <p><span>Usuário</span></p>
                                <input 
                                    onChange={(e)=>setUser(e.target.value)} 
                                    style={{width:250, marginBottom:20}} 
                                    placeholder="Seu Usuário"
                                />
                            </label>
                            <label>
                                <p><span>Senha</span></p>
                                <input
                                    ref={inputPass} 
                                    onChange={(e)=>setPass(e.target.value)} 
                                    type="password" 
                                    style={{width:250,  marginBottom:20}} 
                                    placeholder="Sua Senha"
                                />
                            </label>
                        </Col>
                    </Row>
                    <Row style={{margin:0, padding:0}}>
                        <Col 
                            style={{
                                margin:0, 
                                padding:0, 
                                flexDirection:'column', 
                                justifyContent:'center', 
                                alignItems:'center', 
                                textAlign:'center'
                            }}>
                            <Button 
                                disabled={btnLogarDisable} 
                                ref={btnLogar} 
                                onClick={Logar} 
                                style={{
                                    background:'#FF414D', 
                                    border:0, 
                                    width:250, 
                                    height:50, 
                                    borderRadius:8 
                                }}>
                                Entrar
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{margin:0, padding:0, justifyContent:"center"}}>
                        <Alert hidden={!erroVisible} variant='danger' onClose={() => setErroVisible(false)} dismissible style={{marginBottom:0, marginTop:10, textAlign:'center', width:250, borderRadius:8, fontSize:13 }}>
                            Usuário ou senha invalida!
                        </Alert>
                    </Row>
                </Col>
                <Col></Col>
            </Row>
        </div>
    )

}

export default Login;
