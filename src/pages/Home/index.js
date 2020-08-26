import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Container, Row, Col, Image} from 'react-bootstrap';
import {parseQueryString} from '../../controllers/Tools'
import Api from '../../services/api'
import BtnLogin from '../../components/BtnLogin'
import ButtonCustom from '../../components/ButtonCustom'
import Config from '../../config/global'
import './style.css'

const Home = () => {
    const history = useHistory()
    const [btnNovoPedidoVisible, setBtnNovoPedidoVisible] = useState(false)
    const [btnFaleConoscoVisible, setBtnFaleConoscoVisible] = useState(false)
    const [nomeEmpresa, setNomeEmpresa] = useState("")
    const [msgSaudacao, setMsgSaudacao] = useState("")
    const [numeroContato, setNumeroContato] = useState("")
    const [msgLjFechada, setMsgLjFechada] = useState("")
    const [srcLogo, setSrcLogo] = useState(window.location.origin+"/img/img_indisponivel.png")

    useEffect(()=>{
        console.log(window.location.search)
        var params = parseQueryString();
        let pagina = params["r"]

        switch (pagina){
            case "pedido":
                history.replace('/pedido')
                break
            case "pb":
                history.replace('/pb/'+params["v"])
                break
            case "login":
                history.replace('/login')
                break
            case "finalizar":
                history.replace("/finalizar")
                break
            case "dashboard":
                history.replace("/dashboard")
                break
        }

        Api.get("licenciada").then(response =>{
            if(response.status === 200){
                setNomeEmpresa(response.data[0].nome_fantasia)

                if(response.data[0].logo.length > 0){
                    setSrcLogo(Config.repositorioImg+response.data[0].logo)
                }else{
                    setSrcLogo(window.location.origin+"/img/img_indisponivel.png")
                }

                setMsgSaudacao(response.data[0].msg_saudacao)
                setMsgLjFechada(response.data[0].msg_loja_fechada)
                setNumeroContato(response.data[0].contato)
            }
        }).catch(error=>{
            console.log(error)
            return
        })

        Api.get('session').then(response=>{
            if(response.status === 200){
                if(response.data){
                    setBtnNovoPedidoVisible(true)
                }
            }
        }).catch(error=>{
            console.log(error)
            return
        })

        Api.get("parametro").then(response =>{
            if(response.status === 200){
                response.data.forEach(param => {
                    switch(param.nome) {
                        case "INTEGRA_WHATSAPP":
                            setBtnFaleConoscoVisible(param.valor === "1" ? true : false)
                            break
                    }
                })
            }
        }).catch(error=>{
            console.log(error)
            return
        })
    },[])


    function handleNovoPedido(){
        history.push('/pedido')
    }

    function FaleConosco(){
        window.open(`https://wa.me/55${numeroContato}`)
    }
    
    return(
        <Container>
            <Row 
                style={{
                    textAlign:'center'
                }}>
                <Col/>
                <Col 
                    md='8' 
                    className="container-central-pghome">
                    <Row>
                        <BtnLogin />
                    </Row>
                    <Image 
                        src={srcLogo}
                        roundedCircle 
                        className="img-logo-pghome"
                        alt="logo" 
                    />
                    <Row 
                        hidden={!btnNovoPedidoVisible} 
                        className='container-saudacao-pghome'>
                        <Col>
                            <p className="titulo-saudacao-pghome">
                                Olá, seja bem-vindo(a) ao <br/><strong>{nomeEmpresa}</strong>
                            </p>
                            <p>{msgSaudacao}</p>
                        </Col>
                    </Row>
                    <Row 
                        hidden={btnNovoPedidoVisible} 
                        className='container-saudacao-pghome'>
                        <Col>
                            <p className="titulo-saudacao-pghome">
                                Olá, seja bem-vindo(a) ao <br/><strong>{nomeEmpresa}</strong>
                            </p>
                            <p>{msgLjFechada}</p>
                        </Col>
                    </Row>
                    <Row style={{justifyContent:'center', padding:10}}>
                        <ButtonCustom
                            variant="info" 
                            onClick={handleNovoPedido} 
                            title="Novo Pedido" 
                            hidden={!btnNovoPedidoVisible}
                            width="50%" 
                        />
                    </Row>
                    {/*<Row style={{justifyContent:'center', padding:10}}>
                        <ButtonCustom
                            variant="info" 
                            title="Cadastro" 
                            width="50%" 
                        />
                    </Row>*/}
                    {btnFaleConoscoVisible && <Row style={{justifyContent:'center', padding:10}}>
                        <ButtonCustom
                            variant="success" 
                            onClick={FaleConosco} 
                            title="Fale Conosco!"
                            width="50%" 
                        />
                    </Row>}
                </Col>
                <Col/>
            </Row>
        </Container>
    )
};

export default Home;

