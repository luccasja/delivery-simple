import React, {useEffect, useState, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import Logo from '../../img/Logo.jpeg'
import connection from '../../img/connection.jpg'
//import Print from '../../img/print.png'
import Delete from '../../img/delete.png'
import img_indisponivel from '../../img/img_indisponivel.png'
import {Alert, DropdownButton, ButtonGroup, Dropdown, Container, Row, Col, Image, Button, Modal, Navbar, InputGroup, FormControl, Spinner} from 'react-bootstrap';
import ReactToPrint from "react-to-print";
import Api from '../../services/api'
import socketIOClient from 'socket.io-client'
import InputMask from 'react-input-mask';
import Switch from '../../components/Switch'

const Dashboard = () =>{
    const [pedidos, setPedidos] = useState([])
    const [produtos, setProdutos] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showModalCadPrd, setShowModalCadPrd] = useState(false)
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [showAlertLojaFechada, setShowAlertLojaFechada] = useState(false)
    const [confirmShow, setConfirmShow] = useState(false)
    const [id, setId] = useState(0)
    const [createdAt, setCreatedAt] = useState('')
    const [nome_cliente, setNomeCliente] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco_entrega, setEnderecoEntrega] = useState('')
    const [numero_entrega, setNumeroEntrega] = useState('')
    const [bairro_entrega, setBairroEntrega] = useState('')
    const [complemento_entrega, setComplementoEntrega] = useState('')
    const [troco, setTroco] = useState(0)
    const [frete, setFrete] = useState(0)
    const [qntd_item, setQntdItem] = useState(0)
    const [valor_total, setValorTotal] = useState(0)
    const [dt_finalizacao, setDtFinalizacao] = useState(null)
    const [frm_pagamento, setFrmPagamento] = useState('')
    const [itensPedido, setItensPedido] = useState([])
    const [tituloJanela, setTituloJanela] = useState('Pedidos')
    const [jenelaPedidoVisible, setJenelaPedidoVisible] = useState(true)
    const [jenelaPerfilVisible, setJenelaPerfilVisible] = useState(false)
    const [jenelaProdutoVisible, setJenelaProdutoVisible] = useState(false)
    const [prd_titulo, setPrdTitulo] = useState('')
    const [prd_descricao, setPrdDescricao] = useState('')
    const [prd_img_dir, setPrdImgDir] = useState('')
    const [prd_valor_unitario, setPrdValorUnitario] = useState(0)
    const [prd_situacao, setPrdSituacao] = useState(0)
    const [prd_situacaoDisable, setPrdSituacaoDisable] = useState(true)
    const [idProdutoSelecionado, setIdProdutoSelecionado] = useState(0)
    const [nomeProdutoSelecionado, setNomeProdutoSelecionado] = useState('')
    const [idVisible, setIdVisible] = useState(false)
    const [loadding, setLoadding] = useState(true)
    const [prdAtualizado, setPrdAtualizado] = useState(0)
    const [tituloModalCadPrd, setTituloModalCadPrd] = useState('')
    const [showStatusOnline, setShowStatusOnline] = useState(false)
    const [showStatusOffline, setShowStatusOffline] = useState(false)
    const [showStatusDefault, setShowStatusDefault] = useState(true)
    const [tituloStatus, setTituloStatus] = useState('Carregando...')
    const [pedidoLoading, setPedidoLoading] = useState(true)
    const [produtoLoading, setProdutoLoading] = useState(true)
    const [perfilLoading, setPerfilLoading] = useState(false)
    const [value, setValue] = useState(false);
    const [value2, setValue2] = useState(false);
    const location = useLocation()
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

    const nomePrdRef = useRef()
    const descricaoPrdRef = useRef()
    const dirImgPrdRef = useRef()
    const valorUnitarioPrdRef = useRef()
    const situacaoPrdRef = useRef()
    const btnNovoProduto = useRef()
    const pedidoRef = useRef()
    const pedidoImpRef = useRef()
    const dropStatusRef = useRef()

    const listBtnRefs = []
    const listBtnAlterar = []
    //const serverURL = 'https://api.finamassa.online'
    const serverURL = 'http://localhost:3000'

    useEffect(()=>{
        const socket = socketIOClient(serverURL)
        socket.on('hasPedido', receivedInfo=>{
            if(receivedInfo){
                setPrdAtualizado(receivedInfo)
            }
        })

        let islogged = localStorage.getItem('@delivery/islogged')
        if(islogged === 'false'){
            history.replace('/')
        }
        
        Api.get('pedido/data/'+GetFormattedDateIni()+'/'+GetFormattedDateFim()).then(response =>{
            setPedidos(response.data)
            setPedidoLoading(false)
        }).catch(error=>{
            console.log(error)
            setPedidoLoading(false)
            setShowModalConnection(true)
            return
        })

        Api.get('produto').then(response =>{
            setProdutos(response.data)
            setProdutoLoading(false)
        }).catch(error=>{
            console.log(error)
            setProdutoLoading(false)
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
        }
    },[prdAtualizado])

    function Moeda(value){
        return Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)
    }

    function DataFormat(value){
        if(value === undefined){
            return
        }
        return Intl.DateTimeFormat('pt-BR', {year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'America/Sao_Paulo',
        hour12: false,}).format(new Date(value))
    }

    function BuscarPedido(pedido = 0){
        if(pedido === 0){
            return
        }

        Api.get('pedido/'+pedido).then(res=>{

            if(res.status === 200){
                if(res.data.length === 0){
                    return 
                }
                let resultado = []
                resultado.push(res.data)
                setPedidos(resultado)
                return
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function BuscarPedidoPorData(data){
        if(data === undefined){
            return
        }

        if(data.length === 10){
            let dia = data.substring(0,2)
            let mes = data.substring(3,5)
            let ano = data.substring(6,10)
            const dataFormatada = +ano+'-'+mes+'-'+dia
            dia = parseInt(dia)+1
            if(dia < 10){
                dia = '0'+dia
            }
            const diaSeguinteFormatado = +ano+'-'+mes+'-'+dia
            let data_ini = dataFormatada+'T03:00:00.000Z'
            let data_fim = diaSeguinteFormatado+'T03:00:00.000Z'

            Api.get('pedido/data/'+data_ini+'/'+data_fim).then(res=>{
                if(res.status === 200){
                    if(res.data.length === 0){
                        return 
                    }
                    setPedidos(res.data)
                    return
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }
    }

    function FinalizarPedido(id, indice){
        if(listBtnRefs[indice].textContent === 'Finalizar'){
            Api.put('pedido/'+id+'/registrar').then(response =>{
                if(response.status === 200){
                    if(response.data.Ok){
                        let lista = pedidos
                        lista[indice].entregue = 1
                        lista[indice].dt_finalizacao = new Date()
                        setPedidos(lista)
                        BtnFinalizadoStyle(indice)
                        listBtnRefs[indice].blur()
                    }
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }
        if(listBtnRefs[indice].textContent === 'Receber'){
            Api.put('pedido/'+id+'/receber').then(response =>{
                if(response.status === 200){
                    if(response.data.Ok){
                        let lista = pedidos
                        lista[indice].recebido = 1
                        setPedidos(lista)
                        BtnRecebidoStyle(indice)
                        listBtnRefs[indice].blur()
                    }
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
        }
        listBtnRefs[indice].blur()
    }

    function BtnFinalizadoStyle(indice){
        listBtnRefs[indice].style.borderColor = '#47CE43'
        listBtnRefs[indice].style.background ='#47CE43'
        listBtnRefs[indice].style.color ='#FFF'
        listBtnRefs[indice].textContent ='Entregue'
    }

    function BtnRecebidoStyle(indice){
        listBtnRefs[indice].style.borderColor = '#199cff'
        listBtnRefs[indice].style.background ='#199cff'
        listBtnRefs[indice].style.color ='#FFF'
        listBtnRefs[indice].textContent ='Finalizar'
    }

    function GetFormattedDateIni() {
        var todayTime = new Date();
        var month = todayTime.getMonth() + 1;
        if(month < 10){
            month = '0'+month
        }
        var day = todayTime.getDate()
        if(day < 10){
            day = '0'+day
        }
        var year = todayTime.getFullYear()
        return year + "-" + month +  "-" + day +'T03:00:00.00Z' ;
    }

    function GetFormattedDateFim() {
        var todayTime = new Date();
        var month = todayTime.getMonth() + 1;
        if(month < 10){
            month = '0'+month
        }
        var day = todayTime.getDate()
        if(day < 9){
            day++
            day = '0'+day
        }
        if(day > 9){
            day++
        }
        var year = todayTime.getFullYear()
        return year + "-" + month +  "-" + day +'T03:00:00.00Z';
    }

    async function ModalShow(pedido){
        setId(pedido.id)
        await Api.get('pedido/'+pedido.id+'/item').then(response=>{
            setItensPedido(response.data)
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
        setCreatedAt(DataFormat(pedido.createdAt))
        if(pedido.dt_finalizacao !== null){
            setDtFinalizacao(DataFormat(pedido.dt_finalizacao))
        }
        setNomeCliente(pedido.nome_cliente)
        setCpf(pedido.cpf)
        setTelefone(pedido.telefone)
        setEnderecoEntrega(pedido.endereco_entrega)
        setNumeroEntrega(pedido.numero_entrega)
        setComplementoEntrega(pedido.complemento_entrega)
        setBairroEntrega(pedido.bairro_entrega)
        setQntdItem(pedido.qntd_item)
        setFrmPagamento(pedido.frm_pagamento)
        setValorTotal(pedido.valor_total)
        setTroco(pedido.troco)
        setFrete(pedido.frete)
        setShowModal(true)
    }

    function ExibirJanelaPedido(){
        localStorage.setItem('@delivery/janela','Pedido')
        setTituloJanela('Pedido')
        btnActive(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        setJenelaPedidoVisible(true)
        setJenelaProdutoVisible(false)
        setJenelaPerfilVisible(false)
    }

    function ExibirJanelaPerfil(){
        localStorage.setItem('@delivery/janela','Perfil')
        setTituloJanela('Perfil')
        btnActive(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        setJenelaPerfilVisible(true)
        setJenelaProdutoVisible(false)
        setJenelaPedidoVisible(false)

    }

    function ExibirJanelaProduto(){
        localStorage.setItem('@delivery/janela','Produto')
        setTituloJanela('Produto')
        btnActive(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        setJenelaProdutoVisible(true)
        setJenelaPedidoVisible(false)
        setJenelaPerfilVisible(false)
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

    function LimitarString(value = '', maxLength = 0){
        if(value.length > maxLength){
            return value.substring(0, maxLength)+'...'
        }
        return value
    }

    function CadastrarProduto(){
        if(nomePrdRef.current.value === "" || nomePrdRef.current.value.length < 3){
            alert('Campo nome obrigatorio')
            nomePrdRef.current.focus()
            return 
        }

        if(descricaoPrdRef.current.value === "" || descricaoPrdRef.current.value.length < 3){
            alert('Campo descrição obrigatorio')
            descricaoPrdRef.current.focus()
            return 
        }

        if(valorUnitarioPrdRef.current.value === '0' || valorUnitarioPrdRef.current.value === '' || valorUnitarioPrdRef.current.value === ','){
            alert('Campo valor obrigatorio')
            valorUnitarioPrdRef.current.focus()
            return 
        }

        const produto = {
            nome: prd_titulo,
            descricao: prd_descricao,
            dir_img: prd_img_dir,
            valor_unitario: prd_valor_unitario,
            ativo: prd_situacao
        }

        if(idVisible){
            setLoadding(true)
            Api.put(`produto/${idProdutoSelecionado}/update`, produto).then(response =>{
                if(response.status === 200){
                    //alert('Produto atualizado com sucesso!')
                    setIdProdutoSelecionado(0)
                    setIdVisible(false)
                    setPrdTitulo('')
                    setPrdDescricao('')
                    setPrdImgDir('')
                    setPrdValorUnitario(0)
                    setLoadding(false)
                    setShowModalCadPrd(false)
                    setPrdAtualizado(idProdutoSelecionado)
                }else{
                    alert('Falha na atualização do produto, tente novamente!')
                    setLoadding(false)
                }
            })
            return
        }else{
            setLoadding(true)
            Api.post('produto', produto).then(response =>{
                if(response.status === 200){
                    //alert('Cadastro realizado com sucesso! ID:'+response.data.Ok)
                    setIdVisible(false)
                    setPrdTitulo('')
                    setPrdDescricao('')
                    setPrdImgDir('')
                    setPrdValorUnitario(0)
                    setShowModalCadPrd(false)
                    setLoadding(false)
                    setPrdAtualizado(response.data.Ok.id)
                }else{
                    alert('Falha ao cadastrar o produto, tente novamente!')
                    setLoadding(false)
                }
            })
        }
    }

    function ConfirmarExclusao(){
        let idx = idProdutoSelecionado
        setLoadding(true)
        Api.delete('produto/'+idx).then(response =>{
            if(response.status === 200){
                if(response.data.Ok){
                    setProdutos(produtos.filter(item=> item.id !== idx))
                    setConfirmShow(false)
                    setLoadding(false)
                    setPrdAtualizado(idx)
                }else{
                    alert('Produto associado a pedidos não pode ser excluido')
                    setConfirmShow(false)
                    setLoadding(false)
                }
                
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function DeleteShow(id_produto, nome_produto){
        setIdProdutoSelecionado(id_produto)
        setNomeProdutoSelecionado(nome_produto)
        setConfirmShow(true)
    }

    function EditarShow(id, nome, descricao, valorUnitario, ativo, idx){
        setTituloModalCadPrd('Alterar Cadastro de Produto')
        setLoadding(false)
        setIdProdutoSelecionado(id)
        setPrdTitulo(nome)
        setPrdDescricao(descricao)
        setPrdValorUnitario(valorUnitario)
        setPrdSituacao(ativo)
        setPrdSituacaoDisable(false)
        setIdVisible(true)
        setShowModalCadPrd(true)
        listBtnAlterar[idx].blur()
    }

    function NovoProdutoShow(){
        setTituloModalCadPrd('Novo Produto')
        setLoadding(false)
        setPrdTitulo('')
        setPrdDescricao('')
        setPrdValorUnitario(0)
        setIdProdutoSelecionado(0)
        setPrdSituacao(1)
        setPrdSituacaoDisable(true)
        setIdVisible(false)
        setShowModalCadPrd(true)
        btnNovoProduto.current.blur()
    }

    function BuscarProdutoPorPK(id){
        id = id.replace(' ','')
        if(id === '' || id === undefined){
            Api.get('produto/').then(response =>{
                if(response.status === 200){
                    if(response.data.length === 0){
                        return
                    }
                    setProdutos(response.data)
                    return
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }
        setProdutoLoading(true)
        Api.get('produto/'+id).then(response =>{
            if(response.status === 200){
                if(response.data.length === 0){
                    return
                }else{
                    let result = []
                    result.push(response.data)
                    setProdutoLoading(false)
                    if(result.length > 0){
                        setProdutos(result)
                    }
                }
            }
        }).catch(error=>{
            console.log(error)
            setProdutoLoading(false)
            setShowModalConnection(true)
            return
        })
    }

    function BuscarProdutoPorNome(nome){
        if(nome === '' || nome === undefined){
            Api.get('produto/').then(response =>{
                if(response.status === 200){
                    if(response.data.length === 0){
                        return
                    }
                    setProdutos(response.data)
                    return
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }

        Api.get('produto/nome/'+nome).then(response =>{
            if(response.status === 200){
                if(response.data.length === 0){
                    return
                }
                setProdutos(response.data)
                return
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
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
                if(response.data){
                    localStorage.setItem('@delivery/islogged', 'false')
                    history.replace('/')
                    return
                }
                alert('Falha ao tentar sair do sistema, tente novamente')
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }
    
    return(
        <div style={{margin:0, padding:0}}>
            <Navbar style={{background:'#F43d'}}>
            <Navbar.Brand style={{color:'#FFF', textAlign:'center'}}>Fina Massa</Navbar.Brand>
            </Navbar>
            
            <Row style={{width:'100%', margin:0}}>
                <Col md='3' style={{background:'#FFF', textAlign:'center'}}>
                    <Row style={{marginTop:20, paddingBottom:20, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3'}}>
                        <Col>
                            <Image src={Logo} style={{height:50, width:50}} alt='logo' />
                            <p><strong>Fina Massa</strong></p>
                        </Col>
                    </Row>
                    <Row style={{margin:0, padding:0, paddingBottom:3, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3'}}>
                        <Col hidden={!showStatusOnline} xs='4' style={{margin:0, padding:0}}>
                            <div style={{height:15, width:15, background:'#2ecc71', borderRadius:7.5, marginTop:10, marginLeft:50}}/>
                        </Col>
                        <Col hidden={!showStatusOffline} xs='4' style={{margin:0, padding:0}}>
                            <div style={{height:15, width:15, background:'#e74c3c', borderRadius:7.5, marginTop:10, marginLeft:50}}/>
                        </Col>
                        <Col hidden={!showStatusDefault} xs='4' style={{margin:0, padding:0}}>
                            <div style={{height:15, width:15, background:'#E3E3E3', borderRadius:7.5, marginTop:10, marginLeft:50}}/>
                        </Col>
                        
                        <Col xs='8' style={{margin:0, padding:0, textAlign:'start'}}>
                            <DropdownButton
                                as={ButtonGroup}
                                drop={'right'}
                                title={tituloStatus}
                                ref={dropStatusRef}
                                variant={'Info'}
                                style={{width:80, background:'#FFF'}}
                                >
                                <Dropdown.Item eventKey="1" onClick={()=>Sessao(1)}>Loja Aberta</Dropdown.Item>
                                <Dropdown.Item eventKey="2" onClick={()=>Sessao(0)}>Loja Fechada</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="3" onClick={LogOff}>Sair</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row ref={bgBtnPerfilRef}>
                        <Button ref={btnPerfilRef} onClick={ExibirJanelaPerfil} style={{width:'100%', borderRadius:0, borderBottomStyle:'solid', borderBottomWidth:1, borderBottomColor:'#e3e3e3', background:'#fff', borderColor:'#FFF', marginTop:1, marginBottom:1, }}>
                            <p ref={btnPerfilTextRef} style={{fontWeight:'bold'}}>Perfil</p>
                        </Button>
                    </Row>
                    <Row ref={bgBtnPedidoRef} style={{background:'#F43d'}}>
                        <Button ref={btnPedidoRef} onClick={ExibirJanelaPedido} style={{width:'100%', borderRadius:0, borderBottomStyle:'solid', borderBottomWidth:1, borderBottomColor:'#e3e3e3', background:'#fff', borderColor:'#FFF', marginTop:1, marginBottom:1, }}>
                            <p ref={btnPedidoTextRef} style={{color:'#F43d', fontWeight:'bold'}}>Pedidos</p>
                        </Button>
                    </Row>
                    <Row ref={bgBtnProdutoRef}>
                        <Button ref={btnProdutoRef} onClick={ExibirJanelaProduto} style={{width:'100%', borderRadius:0, borderBottomStyle:'solid', borderBottomWidth:1, borderBottomColor:'#e3e3e3', background:'#fff', borderColor:'#FFF', marginTop:1, marginBottom:1, }}>
                            <p ref={btnProdutoTextRef} style={{fontWeight:'bold'}}>Produtos</p>
                        </Button>
                    </Row>
                </Col>
                <Col md='9' style={{padding:15, paddingBottom:0, width:'100%', minHeight:700}}>
                    <Col style={{background:'#FFF', borderRadius:8, height:'100%'}}>
                        <Container style={{textAlign:'center'}}>
                            <p style={{fontSize:20, padding:10}}><strong >{tituloJanela}</strong></p>
                            <Switch btnSize={26} lableHeight={30} isOn={value} handleToggle={() => setValue(!value)} />
                            <Switch id={'btn2'} isOn={value2} onColor="#EF476F" handleToggle={() => setValue2(!value2)}  />
                        </Container>
                        <Container hidden={!jenelaPedidoVisible} style={{padding:0, marginTop:0}}>
                            <Row>
                                <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0, marginBottom:10}}/>
                            </Row>
                            <Row>
                                <Col md='6' my-auto='true'>
                                    <p><strong>Pedido</strong><input style={{fontWeight:'bold', marginLeft:10,  width:100}} onChange={e => BuscarPedido(e.target.valueAsNumber)} type="number" placeholder='99999'/></p>
                                </Col>
                                <Col md='6' my-auto='true'>
                                    <p><strong>Data</strong><InputMask mask='99/99/9999' maskChar=' ' style={{fontWeight:'bold', marginLeft:10, width:170}} onChange={e => BuscarPedidoPorData(e.target.value)} placeholder='01/01/2020'/></p>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0, marginBottom:10}}/>
                            </Row>
                            <Row hidden={!pedidoLoading} style={{margin:0, padding:0, justifyContent:'center', alignItems:'center', height:200}}>
                                <Spinner animation="border" variant="info" />
                            </Row>
                            {
                                pedidos.map((item, idx) =>(
                                    <div key={item.id}>
                                        <Row style={{padding:0}}>
                                            <Col onClick={()=>ModalShow(item)} md='8' style={{padding:10, paddingLeft:20, cursor:'pointer'}}>
                                                <p><strong style={{color:'#F97A7A'}}>Pedido: {item.id}</strong> - <strong>{DataFormat(item.createdAt)}</strong></p>
                                                <p>{item.nome_cliente} - {item.telefone}</p>
                                                <p>{item.endereco_entrega}, {item.numero_entrega}, {item.bairro_entrega}, {item.complemento_entrega}</p>
                                                <p>Quantidade de Itens: <strong>{item.qntd_item}</strong></p>
                                                {!item.recebido && <span style={{fontSize:13, height:30, background:'#199cff', color:'#FFF', padding:3, paddingLeft:10, paddingRight:10, borderRadius:3}}>Novo</span>}
                                            </Col>
                                            <Col md='4' my-auto="true" style={{textAlign:'center', padding:0, margin:0}}>
                                                <p style={{fontSize:20, width:'100%', marginBottom:5}}><strong>{Moeda(item.valor_total)}</strong></p>
                                                {
                                                    item.entregue === 1 && item.recebido === 1
                                                    ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> FinalizarPedido(item.id, idx)} style={{background:'#47CE43', color:'#FFF', fontWeight:'bold', borderColor:'#47CE43', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }} >Entregue</Button>
                                                    : <span/>
                                                }
                                                {
                                                    item.entregue === 0 && item.recebido === 1
                                                    ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> FinalizarPedido(item.id, idx)} style={{background:'#199cff', color:'#FFF', fontWeight:'bold', borderColor:'#199cff', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }} >Finalizar</Button>
                                                    : <span/>
                                                } 
                                                {
                                                    item.entregue === 0 && item.recebido === 0
                                                    ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> FinalizarPedido(item.id, idx)} style={{background:'#FFF', color:'#F43d', fontWeight:'bold', borderColor:'#F43d', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }}>Receber</Button> 
                                                    : <span/>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{width:'100%', height:0.5, background:'#E3E3E3', marginTop:0, marginBottom:10}}/>
                                        </Row>
                                    </div>
                                    
                                ))
                            }
                        </Container>
                        <Container hidden={!jenelaProdutoVisible} style={{padding:0, marginTop:0}}>
                            <Row>
                                <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0, marginBottom:20}}/>
                            </Row>
                            <Row style={{margin:0, padding:0}}>
                                <Col md='3' my-auto='true'>
                                    <p><strong>ID</strong><input type='number' style={{fontWeight:'bold', marginLeft:10,  width:100}} onChange={e => BuscarProdutoPorPK(e.target.value)} maxLength={5} placeholder='99999'/></p>
                                </Col>
                                <Col md='6' my-auto='true'>
                                    <p><strong>Nome</strong><input style={{fontWeight:'bold', marginLeft:10}} onChange={e => BuscarProdutoPorNome(e.target.value)} maxLength="100" placeholder='Pastel...'/></p>
                                </Col>
                                <Col md='3' style={{textAlign:'center'}}>
                                    <Button variant="info" ref={btnNovoProduto} onClick={NovoProdutoShow} style={{fontWeight:'bold', height:40, width:200, borderRadius:8}}>
                                        Novo
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:10, marginBottom:10}}/>
                            </Row>
                            <Row hidden={!produtoLoading} style={{margin:0, padding:0, justifyContent:'center', alignItems:'center', height:200}}>
                                <Spinner animation="border" variant="info" />
                            </Row>
                            {
                                produtos.map((produto, idx) => (
                                    <Row key={produto.id} style={{justifyContent:'center', alignItems:'center',padding:0, margin:0, borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:15, paddingBottom:15}}>
                                        <Col xs='2' my-auto="true">
                                            <Image src={img_indisponivel} roundedCircle style={{height:40, width:40, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1}} alt='imagem do produto' />
                                        </Col>
                                        <Col xs='5' my-auto="true" style={{textAlign:'start', padding:0, margin:0}}>
                                            <p><strong style={{color:'#F97A7A'}}>ID: {produto.id}</strong><strong> - {produto.nome}</strong></p>
                                            <p style={{fontSize:13}}>{LimitarString(produto.descricao, 60)}</p>
                                            {!produto.ativo && <span style={{fontSize:13, height:30, background:'#F43d', color:'#FFF', padding:3, borderRadius:3, paddingLeft:10, paddingRight:10}}>Inativo</span>}
                                        </Col>
                                        <Col xs='2' my-auto="true" style={{padding:0, margin:0}}>
                                            <p style={{fontSize:20}}><strong>{Moeda(produto.valor_unitario)}</strong></p>
                                        </Col>
                                        <Col xs='2' my-auto="true" style={{padding:0, margin:0}}>
                                            <Button ref={ref => listBtnAlterar[idx] = ref} onClick={()=>EditarShow(produto.id, produto.nome, produto.descricao, produto.valor_unitario, produto.ativo, idx)} style={{background:'#FFF', color:'#F43d', fontWeight:'bold', borderColor:'#F43d', margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }}>Alterar</Button>
                                        </Col>
                                        <Col xs='1' my-auto="true" style={{padding:0, margin:0, cursor:'pointer',}}>
                                            <Image src={Delete} onClick={()=>DeleteShow(produto.id, produto.nome)} roundedCircle style={{height:30, width:30}} alt='Deletar' />
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Container>
                    </Col>
                </Col>
            </Row>
            <Modal show={showModal} onHide={()=> setShowModal(false)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Row ref={pedidoRef} style={{justifyContent:'center', alignItems:'center', flexDirection:'column', margin:0, padding:0}}>
                        <p><strong style={{color:'#F97A7A', fontSize:20}}>Pedido: {id}</strong></p>
                        <p>Criação: <strong>{createdAt}</strong></p>
                        {
                            dt_finalizacao !== null
                            ? <p>Finalização: <strong>{dt_finalizacao}</strong></p>
                            : <p/>
                        }
                        <p><strong>{nome_cliente}</strong></p>
                        {
                            cpf !== '' && 
                            <p><strong>CPF: </strong>{cpf}</p>
                        }
                        <p><strong>{telefone}</strong></p>
                        <p>Endereço:</p>
                        <p>{endereco_entrega}, {numero_entrega} {complemento_entrega}</p>
                        <p>{bairro_entrega}</p>
                        <div style={{width:'30%', height:0.5, background:'#E3E3E3', marginTop:10}}/>
                        <div style={{marginTop:20, marginBottom:10}}>
                        {
                            itensPedido.map(item=>(
                                <div key={item.id}>
                                    <p>{item.produto.nome} - <strong>{item.quantidade}x </strong>{Moeda(item.valor_unitario)} - <strong>{Moeda(item.valor_total)}</strong></p>
                                    {
                                        item.observacoes !== '' 
                                        ? <p style={{width:250, marginBottom:5}}><strong>Obs: </strong>{item.observacoes}</p>
                                        : <p/>
                                    }
                                </div>
                            ))
                        }
                        </div>
                        <div style={{width:'30%', height:0.5, background:'#E3E3E3', marginTop:0, marginBottom:10}}/>
                        <p><strong>Totais</strong></p>
                        <p>Itens incluso: <strong>{qntd_item}</strong></p>
                        <p>Forma de Pagamento: <strong>{frm_pagamento}</strong></p>
                        <p>Frete: <strong>{Moeda(frete)}</strong></p>
                        <p>Total do Pedido: <strong>{Moeda(valor_total)}</strong></p>
                        <p>Troco Para: <strong>{Moeda(troco)}</strong></p>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <ReactToPrint
                    trigger={()=><Button style={{background:'#F97A7A', width:200, borderColor:'#FFF'}}>
                                    Imprimir
                                </Button>}
                    content={() => pedidoImpRef.current}
                />
                </Modal.Footer>
            </Modal>
            <Modal show={showModalCadPrd} onHide={()=> setShowModalCadPrd(false)}>
                <Modal.Header closeButton>
                    <strong>{tituloModalCadPrd}</strong>
                </Modal.Header>
                <Modal.Body>
                    <Row style={{margin:0, padding:0, justifyContent:'center', alignItems:'center'}}>
                        <Col>
                        {
                            idVisible && <p><strong style={{color:'#F43d'}}>ID Produto: </strong>{idProdutoSelecionado}</p>
                        }
                        <p><strong>Titulo</strong></p>
                        <input ref={nomePrdRef} value={prd_titulo} onChange={e => setPrdTitulo(e.target.value)} placeholder='Ex: Pastel Misto' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row style={{margin:0, padding:0, justifyContent:'center'}}>
                        <Col xs='7'>
                            <p><strong>Descrição</strong></p>
                            <InputGroup style={{height:120, width:210, marginBottom:10}}>
                                <FormControl ref={descricaoPrdRef} value={prd_descricao} onChange={e => setPrdDescricao(e.target.value)} as="textarea" aria-label="With textarea" maxLength={150} style={{resize: 'none' , margin:0, marginTop:0, background:'#F5F5F5', borderColor:'#E3E3E3'}}/>
                            </InputGroup>
                        </Col>
                        <Col my-auto='true' xs='5'>
                            <p><strong>Foto</strong></p>
                            <Col my-auto='true' style={{borderStyle:'solid', borderWidth:1, borderColor:'#e3e3e3', textAlign:'center', padding:10, borderRadius:8, width:150}}>
                                <Image src={img_indisponivel} roundedCircle style={{height:100, width:100, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1}} alt='imagem do produto'/>
                            </Col>
                        </Col>
                    </Row>
                    <Row  style={{margin:0, padding:0, justifyContent:'center', alignItems:'center'}}>
                        <Col xs='6'>
                            <p><strong>Valor</strong></p>
                            <input ref={valorUnitarioPrdRef} value={prd_valor_unitario} onChange={e => setPrdValorUnitario(e.target.value)} placeholder='0,00' type='number'/>
                        </Col>
                        <Col xs='6'>
                            <p><strong>Situação</strong></p>
                            <select disabled={prd_situacaoDisable} value={prd_situacao} ref={situacaoPrdRef} onChange={e=> setPrdSituacao(e.target.value)} style={{width:'100%'}}>
                                <option value={1}>Ativo</option>
                                <option value={0}>Inativo</option>
                            </select>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                    <Button onClick={CadastrarProduto} style={{background:'#F97A7A', width:200, borderColor:'#FFF'}}>
                    <Spinner animation="border" hidden={!loadding} variant="light" style={{height:20, width:20, marginRight:10}}/>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={confirmShow} onHide={()=>setConfirmShow(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{nomeProdutoSelecionado}</Modal.Title>
                </Modal.Header>
                    <Modal.Body style={{textAlign:'center'}}>Deseja realmente excluir o produto: {nomeProdutoSelecionado}</Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <Button style={{background:'#CCC', width:100, borderColor:'#FFF'}} onClick={()=> setConfirmShow(false)}>
                    Não
                </Button>
                <Button style={{background:'#F97A7A', width:100, borderColor:'#FFF'}} onClick={()=> ConfirmarExclusao()}>
                    Sim
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalConnection} onHide={()=> setShowModalConnection(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Ops...</Modal.Title>
                </Modal.Header>
                    <Modal.Body style={{textAlign:'center'}}>
                        <Image roundedCircle="true" src={connection} style={{height:200, width:200, marginBottom:20}} alt='connection' />
                        <p><strong>Ocorreu um problema de conexão com a internet!</strong></p>
                    </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <Button style={{background:'#F97A7A', width:200, borderColor:'#FFF'}} onClick={()=>window.location.reload(false)}>
                    Atualizar Página
                </Button>
                </Modal.Footer>
            </Modal> 
            <Alert hidden={!showAlertLojaFechada} variant='warning' onClose={() => setShowAlertLojaFechada(false)} dismissible style={{marginBottom:0, textAlign:'center', position:'fixed', top:0, width:'100%'}}>
                <strong>Atenção</strong>, sua loja esta como <strong>fechada</strong> ao publico!
            </Alert>
            
            <div style={{display:'none'}}>
                <div ref={pedidoImpRef} style={{margin:0,padding:10, textAlign:'start', justifyContent:'start'}}>
                    <p style={{fontSize:18, color:'#000', textAlign:'center', width:435}}>
                    <strong>
                        Pastelaria Fina Massa
                    </strong>
                    </p>
                    <p style={{color:'#000', textAlign:'center', width:435}}>
                        <strong>--------</strong>
                    </p>
                    <p style={{fontSize:25, color:'#000', textAlign:'center', width:435}}>
                    <strong>
                        Pedido: {id}
                    </strong>
                    </p>
                    <p style={{fontSize:18, color:'#000', textAlign:'center', width:435}}>
                        Criação: <strong>{createdAt}</strong>
                    </p>
                    {
                        dt_finalizacao !== null
                        ? <p style={{fontSize:18, color:'#000', textAlign:'center', width:435}}>Finalização: <strong>{dt_finalizacao}</strong></p>
                        : <p/>
                    }
                    <p style={{color:'#000', textAlign:'center', width:435}}>
                        <strong>--------</strong>
                    </p>
                    <p style={{fontSize:18, color:'#000'}}><strong>Cliente: </strong>{nome_cliente}</p>
                    {
                        cpf !== '' && 
                        <p style={{fontSize:18, color:'#000'}}><strong>CPF: </strong>{cpf}</p>
                    }
                    <p style={{fontSize:18, color:'#000'}}><strong>Telefone: </strong>{telefone}</p>
                    <p style={{fontSize:18, color:'#000'}}><strong>Endereço: </strong>{endereco_entrega}, {numero_entrega}</p>
                    <p style={{fontSize:18, color:'#000'}}><strong>Bairro: </strong>{bairro_entrega}</p>
                    <p style={{fontSize:18, color:'#000'}}><strong>Referência: </strong>{complemento_entrega}</p>
                    <p style={{color:'#000', textAlign:'center', width:435}}>
                        <strong>--------</strong>
                    </p>
                    <div style={{width:435, textAlign:'center'}}>
                        <Row style={{margin:0, padding:0}}>
                            <Col xs='1' style={{margin:0, padding:0}}>
                                Cod.
                            </Col>
                            <Col xs='5' style={{margin:0, padding:0}}>
                                Produto
                            </Col>
                            <Col xs='2' style={{margin:0, padding:0}}>
                                Qntd.
                            </Col>
                            <Col xs='2' style={{margin:0, padding:0}}>
                                Vlr.
                            </Col>
                            <Col xs='2' style={{margin:0, padding:0}}>
                                Total
                            </Col>
                        </Row>
                    </div>
                    <div style={{color:'#000', textAlign:'center', width:435, marginTop:20, marginBottom:10}}>
                    {
                        itensPedido.map(item=>(
                            <div key={item.id}>
                                <Row style={{margin:0, padding:0}}>
                                    <Col xs='1' style={{margin:0, padding:0}}>
                                    {item.produto.id}
                                    </Col>
                                    <Col xs='5' style={{margin:0, padding:0}}>
                                    {item.produto.nome}
                                    </Col>
                                    <Col xs='2' style={{margin:0, padding:0}}>
                                    {item.quantidade}x
                                    </Col>
                                    <Col xs='2' style={{margin:0, padding:0}}>
                                    {Moeda(item.valor_unitario)}
                                    </Col>
                                    <Col xs='2' style={{margin:0, padding:0}}>
                                    {Moeda(item.valor_total)}
                                    </Col>
                                </Row>
                                {
                                    item.observacoes !== '' 
                                    ? <p style={{fontSize:18, color:'#000', marginBottom:5}}><strong>Obs: </strong>{item.observacoes}</p>
                                    : <p/>
                                }
                            </div>
                        ))
                    }
                    </div>
                    <p style={{fontSize:20, color:'#000', textAlign:'center', width:435}}><strong>Totais</strong></p>
                    <div style={{fontSize:18, color:'#000', textAlign:'center', width:435}}>
                        <Row style={{margin:0, padding:0}}>
                            <Col xs='6' style={{textAlign:'end'}}>
                            Itens incluso: 
                            </Col>
                            <Col xs='6' style={{textAlign:'start'}}>
                            <strong>{qntd_item}</strong>
                            </Col>
                        </Row>
                        <Row style={{margin:0, padding:0}}>
                            <Col xs='6' style={{textAlign:'end'}}>
                            Forma de Pagamento: 
                            </Col>
                            <Col xs='6' style={{textAlign:'start'}}>
                            <strong>{frm_pagamento}</strong>
                            </Col>
                        </Row>
                        <Row style={{margin:0, padding:0}}>
                            <Col xs='6' style={{textAlign:'end'}}>
                            Frete: 
                            </Col>
                            <Col xs='6' style={{textAlign:'start'}}>
                            <strong>{Moeda(frete)}</strong>
                            </Col>
                        </Row>
                        <Row style={{margin:0, padding:0}}>
                            <Col xs='6' style={{textAlign:'end'}}>
                            Total do Pedido: 
                            </Col>
                            <Col xs='6' style={{textAlign:'start'}}>
                            <strong>{Moeda(valor_total)}</strong>
                            </Col>
                        </Row>
                        <Row style={{margin:0, padding:0}}>
                            <Col xs='6' style={{textAlign:'end'}}>
                            Troco Para: 
                            </Col>
                            <Col xs='6' style={{textAlign:'start'}}>
                            <strong>{Moeda(troco)}</strong>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            
        </div>
    )

}

export default Dashboard