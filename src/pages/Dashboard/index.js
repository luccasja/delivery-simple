import React, {useEffect, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Alert, DropdownButton, ButtonGroup, Dropdown, Container, Row, Col, Image, Button, Modal, Navbar, InputGroup, FormControl, Spinner} from 'react-bootstrap';
import Api from '../../services/api'
import Config from '../../config/global'
import './style.css'
import {
    JanelaPedido, 
    JanelaProduto, 
    ModalConnection, 
    JanelaPerfil,
    JanelaConfig,
    JanelaCadastros
} from '../../components'

const Dashboard = () =>{
    const [nomeEmpresa, setNomeEmpresa] = useState("")
    const [srcLogo, setSrcLogo] = useState(window.location.origin+"/img/img_indisponivel.png")
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [showAlertLojaFechada, setShowAlertLojaFechada] = useState(false)
    const [tituloJanela, setTituloJanela] = useState('Pedidos')
    const [janelaPedidoVisible, setJanelaPedidoVisible] = useState(true)
    const [janelaPerfilVisible, setJanelaPerfilVisible] = useState(false)
    const [janelaProdutoVisible, setJanelaProdutoVisible] = useState(false)
    const [janelaCadastrosVisible, setJanelaCadastrosVisible] = useState(false)
    const [janelaConfiguracoesVisible, setJanelaConfiguracoesVisible] = useState(false)
    const [showStatusOnline, setShowStatusOnline] = useState(false)
    const [showStatusOffline, setShowStatusOffline] = useState(false)
    const [showStatusDefault, setShowStatusDefault] = useState(true)
    const [tituloStatus, setTituloStatus] = useState('Carregando...')
    const history = useHistory()
    const btnPerfilRef = useRef()
    const btnPerfilTextRef = useRef()
    const bgBtnPerfilRef = useRef()
    const btnPedidoRef = useRef()
    const btnPedidoTextRef = useRef()
    const bgBtnPedidoRef = useRef()
    const btnProdutoRef = useRef()
    const btnProdutoTextRef = useRef()
    const bgBtnProdutoRef = useRef()
    const btnCadastrosRef = useRef()
    const btnCadastrosTextRef = useRef()
    const bgBtnCadastrosRef = useRef()
    const btnConfiguracoesRef = useRef()
    const btnConfiguracoesTextRef = useRef()
    const bgBtnConfiguracoesRef = useRef()
    const dropStatusRef = useRef()

    useEffect(()=>{
        let islogged = localStorage.getItem('@delivery/islogged')
        if(islogged === 'false'){
            history.replace('/login')
            return
        }

        Api.get("licenciada").then(response =>{
            if(response.status === 200){
                setNomeEmpresa(response.data[0].nome_fantasia)

                if(response.data[0].logo.length > 0){
                    setSrcLogo(Config.repositorioImg+response.data[0].logo)
                }else{
                    setSrcLogo(window.location.origin+"/img/img_indisponivel.png")
                }
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
        
        Api.get('session').then(response=>{
            if(response.status === 200){
                if(response.data){
                    setTituloStatus('Loja Aberta')
                    setShowStatusDefault(false)
                    setShowStatusOnline(true)
                    setShowStatusOffline(false)
                    setShowAlertLojaFechada(false)
                }else{
                    setTituloStatus('Loja Fechada')
                    setShowStatusOnline(false)
                    setShowStatusDefault(false)
                    setShowStatusOffline(true)
                    setShowAlertLojaFechada(true)
                }
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

        if(localStorage.getItem('@delivery/janela') !== null){
            let janela = localStorage.getItem('@delivery/janela')
            
            if(janela === 'Pedido'){
                ExibirJanelaPedido()
                return
            }
            if(janela === 'Produto'){
                ExibirJanelaProduto()
                return
            }
            if(janela === 'Perfil'){
                ExibirJanelaPerfil()
            }
            if(janela === 'Configuracoes'){
                ExibirJanelaConfiguracoes()
            }
            if(janela === 'Cadastros'){
                ExibirJanelaCadastros()
            }
        }
    },[])

    function ExibirJanelaPedido(){
        localStorage.setItem('@delivery/janela','Pedido')
        setTituloJanela('Pedido')
        btnActive(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        btnInative(bgBtnConfiguracoesRef, btnConfiguracoesRef, btnConfiguracoesTextRef)
        btnInative(bgBtnCadastrosRef, btnCadastrosRef, btnCadastrosTextRef)
        setJanelaPedidoVisible(true)
        setJanelaProdutoVisible(false)
        setJanelaPerfilVisible(false)
        setJanelaConfiguracoesVisible(false)
        setJanelaCadastrosVisible(false)
    }

    function ExibirJanelaPerfil(){
        localStorage.setItem('@delivery/janela','Perfil')
        setTituloJanela('Perfil')
        btnActive(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        btnInative(bgBtnConfiguracoesRef, btnConfiguracoesRef, btnConfiguracoesTextRef)
        btnInative(bgBtnCadastrosRef, btnCadastrosRef, btnCadastrosTextRef)
        setJanelaPerfilVisible(true)
        setJanelaProdutoVisible(false)
        setJanelaPedidoVisible(false)
        setJanelaConfiguracoesVisible(false)
        setJanelaCadastrosVisible(false)
    }

    function ExibirJanelaProduto(){
        localStorage.setItem('@delivery/janela','Produto')
        setTituloJanela('Produto')
        btnActive(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnConfiguracoesRef, btnConfiguracoesRef, btnConfiguracoesTextRef)
        btnInative(bgBtnCadastrosRef, btnCadastrosRef, btnCadastrosTextRef)
        setJanelaProdutoVisible(true)
        setJanelaPedidoVisible(false)
        setJanelaPerfilVisible(false)
        setJanelaConfiguracoesVisible(false)
        setJanelaCadastrosVisible(false)
    }

    function ExibirJanelaConfiguracoes(){
        localStorage.setItem('@delivery/janela','Configuracoes')
        setTituloJanela('Configurações')
        btnActive(bgBtnConfiguracoesRef, btnConfiguracoesRef, btnConfiguracoesTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnCadastrosRef, btnCadastrosRef, btnCadastrosTextRef)
        setJanelaProdutoVisible(false)
        setJanelaPedidoVisible(false)
        setJanelaPerfilVisible(false)
        setJanelaConfiguracoesVisible(true)
        setJanelaCadastrosVisible(false)
    }

    function ExibirJanelaCadastros(){
        localStorage.setItem('@delivery/janela','Cadastros')
        setTituloJanela('Cadastros')
        btnActive(bgBtnCadastrosRef, btnCadastrosRef, btnCadastrosTextRef)
        btnInative(bgBtnConfiguracoesRef, btnConfiguracoesRef, btnConfiguracoesTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        setJanelaProdutoVisible(false)
        setJanelaPedidoVisible(false)
        setJanelaPerfilVisible(false)
        setJanelaConfiguracoesVisible(false)
        setJanelaCadastrosVisible(true)
    }

    function btnActive(bg, btn, txt){
        bg.current.style.background = '#F43d'
        txt.current.style.color = '#F43d'
        btn.current.blur()
    }

    function btnInative(bg, btn, txt){
        bg.current.style.background = '#FFF'
        txt.current.style.color = '#707070'
        btn.current.blur()
    }

    function Sessao(situacao){
        if(situacao === 1){
            Api.post('session/'+1).then(response=>{
                if(response.status === 200){
                    if(response.data){
                        setTituloStatus('Loja Aberta')
                        setShowStatusOnline(true)
                        setShowStatusOffline(false)
                        setShowAlertLojaFechada(false)
                        dropStatusRef.current.blur()
                        return
                    }
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
        }
        if(situacao === 0){
            Api.put('session/'+0).then(response=>{
                if(response.status === 200){
                    if(response.data){
                        setTituloStatus('Loja Fechada')
                        setShowStatusOnline(false)
                        setShowStatusOffline(true)
                        setShowAlertLojaFechada(true)
                        dropStatusRef.current.blur()
                        return
                    }
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
        }
    }

    function LogOff(){
        Api.delete('session').then(response=>{
            if(response.status === 200){
                localStorage.setItem('@delivery/islogged', 'false')
                history.replace('/')
                return
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }
    
    return(
        <div className="container-geral-pgdashboard">
            <Row className="container-body-pgdashboard">
                <Col md='3' className="container-menu-pgdashboard">
                    <Row className="container-logo-pgdashboard">
                        <Col>
                            <Image 
                                src={srcLogo} 
                                roundedCircle
                                className="size-logo-pgdashboard" 
                                alt='logo' 
                            />
                            <p>
                                <strong>
                                    {nomeEmpresa}
                                </strong>
                            </p>
                        </Col>
                    </Row>
                    <Row className="container-status-pgdashboard">
                        <Col 
                            hidden={!showStatusOnline} 
                            xs='4' 
                            className="item-status-pgdashboard">
                            <div className="status-ativo-pgdashboard" />
                        </Col>
                        <Col 
                            hidden={!showStatusOffline} 
                            xs='4' 
                            className="item-status-pgdashboard">
                            <div className="status-inativo-pgdashboard" />
                        </Col>
                        <Col 
                            hidden={!showStatusDefault} 
                            xs='4' 
                            className="item-status-pgdashboard">
                            <div className="status-default-pgdashboard" />
                        </Col>
                        <Col xs='8' className="container-drop-btn-pgdashboard">
                            <DropdownButton
                                as={ButtonGroup}
                                drop={'right'}
                                title={tituloStatus}
                                ref={dropStatusRef}
                                variant={'Info'}
                                className="drop-btn-pgdashboard"
                                >
                                <Dropdown.Item 
                                    eventKey="1" 
                                    onClick={()=>Sessao(1)}>
                                    Loja Aberta
                                </Dropdown.Item>
                                <Dropdown.Item 
                                    eventKey="2" 
                                    onClick={()=>Sessao(0)}>
                                    Loja Fechada
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                    eventKey="3" 
                                    onClick={LogOff}>
                                    Sair
                                </Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row ref={bgBtnPerfilRef}>
                        <Button 
                            ref={btnPerfilRef} 
                            onClick={ExibirJanelaPerfil}
                            variant="light" 
                            className="btn-menu-pgdashboard">
                            <p 
                                ref={btnPerfilTextRef} 
                                className="perfil-btn-menu-pgdash">
                                Perfil
                            </p>
                        </Button>
                    </Row>
                    <Row ref={bgBtnPedidoRef} 
                        className="pedidos-btn-menu-pgdash">
                        <Button 
                            ref={btnPedidoRef} 
                            onClick={ExibirJanelaPedido} 
                            variant="light" 
                            className="btn-menu-pgdashboard">
                            <p 
                                ref={btnPedidoTextRef} 
                                className="txt-pedidos-btn-menu-pgdash">
                                Pedidos
                            </p>
                        </Button>
                    </Row>
                    <Row ref={bgBtnProdutoRef}>
                        <Button 
                            ref={btnProdutoRef} 
                            onClick={ExibirJanelaProduto} 
                            variant="light" 
                            className="btn-menu-pgdashboard">
                            <p 
                                ref={btnProdutoTextRef} 
                                className="txt-produtos-btn-menu-pgdash">
                                Produtos
                            </p>
                        </Button>
                    </Row>
                    <Row ref={bgBtnCadastrosRef}>
                        <Button 
                            ref={btnCadastrosRef} 
                            onClick={ExibirJanelaCadastros} 
                            variant="light" 
                            className="btn-menu-pgdashboard">
                            <p 
                                ref={btnCadastrosTextRef} 
                                className="txt-produtos-btn-menu-pgdash">
                                Cadastros
                            </p>
                        </Button>
                    </Row>
                    <Row ref={bgBtnConfiguracoesRef}>
                        <Button 
                            ref={btnConfiguracoesRef} 
                            onClick={ExibirJanelaConfiguracoes} 
                            variant="light" 
                            className="btn-menu-pgdashboard">
                            <p 
                                ref={btnConfiguracoesTextRef} 
                                className="txt-produtos-btn-menu-pgdash">
                                Configurações
                            </p>
                        </Button>
                    </Row>
                </Col>
                <Col md='9' className="container-conteudo-pgdashboard">
                    <Col className="container-exibicao-pgdashboard">
                        <Container className="container-titulo-pgdashboard">
                            <p className="titulo-pgdashboard">
                                <strong>
                                    {tituloJanela}
                                </strong>
                            </p>
                        </Container>
                        <Row style={{margin:0}}>
                            <Col className="separador-titulo-pgdashboard"/>
                        </Row>
                        <JanelaPerfil hidden={!janelaPerfilVisible}/>
                        <JanelaPedido hidden={!janelaPedidoVisible}/>
                        <JanelaProduto hidden={!janelaProdutoVisible}/>
                        <JanelaConfig hidden={!janelaConfiguracoesVisible}/>
                        <JanelaCadastros hidden={!janelaCadastrosVisible}/>
                    </Col>
                </Col>
            </Row>
            <ModalConnection 
                show={showModalConnection} 
                onHide={()=> setShowModalConnection(false)}
            />
            <Navbar className="navbar-pgdashboard" bg="dark">
                <Navbar.Brand>
                    <span className="txt-navbar-pgdashboard">
                        {nomeEmpresa}
                    </span>
                </Navbar.Brand>
            </Navbar> 
            <Alert hidden={!showAlertLojaFechada} fixed="top" variant='warning' onClose={() => setShowAlertLojaFechada(false)} dismissible style={{marginBottom:0, textAlign:'center', position:'fixed', top:50, width:'100%'}}>
                <strong>Atenção</strong>, sua loja esta como <strong>fechada</strong> ao publico!
            </Alert>
        </div>
    )

}

export default Dashboard