import React, {useEffect, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import Logo from '../../img/Logo.jpeg'
import { Container, Row, Col, Image, Button, Modal, Navbar} from 'react-bootstrap';
import Api from '../../services/api'

const Dashboard = () =>{
    const [pedidos, setPedidos] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [id, setId] = useState(0)
    const [createdAt, setCreatedAt] = useState('')
    const [nome_cliente, setNomeCliente] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco_entrega, setEnderecoEntrega] = useState('')
    const [numero_entrega, setNumeroEntrega] = useState('')
    const [bairro_entrega, setBairroEntrega] = useState('')
    const [complemento_entrega, setComplementoEntrega] = useState('')
    const [troco, setTroco] = useState(0)
    const [qntd_item, setQntdItem] = useState(0)
    const [valor_total, setValorTotal] = useState(0)
    const [dt_finalizacao, setDtFinalizacao] = useState(null)
    const [frm_pagamento, setFrmPagamento] = useState('')
    const [itensPedido, setItensPedido] = useState([])
    const [tituloJanela, setTituloJanela] = useState('Pedidos')
    const [jenelaPedidoVisible, setJenelaPedidoVisible] = useState(true)
    const [jenelaPerfilVisible, setJenelaPerfilVisible] = useState(false)
    const [jenelaProdutoVisible, setJenelaProdutoVisible] = useState(false)

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

    const listBtnRefs = []
   
    useEffect(()=>{
        let islogged = localStorage.getItem('@delivery/islogged')
        if(islogged === false){
            history.replace('/login')
        }

        Api.get('pedido/data/'+GetFormattedDateIni()+'/'+GetFormattedDateFim()).then(response =>{
            setPedidos(response.data)
            localStorage.setItem('@delivery/pedidos', JSON.stringify(response.data))
        })
    },[])

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
                    setPedidos(JSON.parse(localStorage.getItem('@delivery/pedidos')))
                    return 
                }
                let resultado = []
                resultado.push(res.data)
                setPedidos(resultado)
                return
            }
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
                        setPedidos(JSON.parse(localStorage.getItem('@delivery/pedidos')))
                        return 
                    }
                    setPedidos(res.data)
                    return
                }
            })
            return
        }
        setPedidos(JSON.parse(localStorage.getItem('@delivery/pedidos')))
    }

    function FinalizarPedido(id, indice){
        if(listBtnRefs[indice].textContent === 'Reabrir'){
            Api.put('pedido/'+id+'/reabrir').then(response =>{
                if(response.status === 200){
                    if(response.data.Ok){
                        let lista = pedidos
                        lista[indice].entregue = 0
                        lista[indice].dt_finalizacao = null
                        setPedidos(lista)
                        BtnReabrirStyle(indice)
                        localStorage.setItem('@delivery/pedidos', JSON.stringify(lista))
                        listBtnRefs[indice].blur()
                    }
                }
            })
            return
        }
        if(listBtnRefs[indice].textContent === 'Finalizar'){
            Api.put('pedido/'+id+'/registrar').then(response =>{
                if(response.status === 200){
                    if(response.data.Ok){
                        let lista = pedidos
                        lista[indice].entregue = 1
                        lista[indice].dt_finalizacao = new Date()
                        setPedidos(lista)
                        BtnFinalizadoStyle(indice)
                        localStorage.setItem('@delivery/pedidos', JSON.stringify(lista))
                        listBtnRefs[indice].blur()
                    }
                }
            })
        }
    }

    function BtnFinalizadoStyle(indice){
        listBtnRefs[indice].style.borderColor = '#47CE43'
        listBtnRefs[indice].style.background ='#47CE43'
        listBtnRefs[indice].style.color ='#FFF'
        listBtnRefs[indice].textContent ='Reabrir'
    }

    function BtnReabrirStyle(indice){
        listBtnRefs[indice].style.borderColor = '#F43d'
        listBtnRefs[indice].style.background ='#FFF'
        listBtnRefs[indice].style.color ='#F43d'
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
        })
        setCreatedAt(DataFormat(pedido.createdAt))
        if(pedido.dt_finalizacao !== null){
            setDtFinalizacao(DataFormat(pedido.dt_finalizacao))
        }
        setNomeCliente(pedido.nome_cliente)
        setTelefone(pedido.telefone)
        setEnderecoEntrega(pedido.endereco_entrega)
        setNumeroEntrega(pedido.numero_entrega)
        setBairroEntrega(pedido.bairro_entrega)
        setQntdItem(pedido.qntd_item)
        setFrmPagamento(pedido.frm_pagamento)
        setValorTotal(pedido.valor_total)
        setTroco(pedido.troco)
        setShowModal(true)
    }

    function ExibirJanelaPedido(){
        setTituloJanela('Pedido')
        btnActive(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        setJenelaPedidoVisible(true)
        setJenelaProdutoVisible(false)
        setJenelaPerfilVisible(false)
    }

    function ExibirJanelaPerfil(){
        setTituloJanela('Perfil')
        btnActive(bgBtnPerfilRef, btnPerfilRef, btnPerfilTextRef)
        btnInative(bgBtnPedidoRef, btnPedidoRef, btnPedidoTextRef)
        btnInative(bgBtnProdutoRef, btnProdutoRef, btnProdutoTextRef)
        setJenelaPerfilVisible(true)
        setJenelaProdutoVisible(false)
        setJenelaPedidoVisible(false)

    }

    function ExibirJanelaProduto(){
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
    
    return(
        <div style={{margin:0, padding:0}}>
            <Navbar style={{background:'#F43d'}}>
            <Navbar.Brand style={{color:'#FFF', textAlign:'center'}}>Fina Massa</Navbar.Brand>
            </Navbar>
            <Row style={{width:'100%'}}>
                <Col md='3' style={{background:'#FFF', textAlign:'center', maxWidth:250}}>
                    <Row style={{marginTop:20, paddingBottom:20, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3'}}>
                        <Col>
                            <Image src={Logo} style={{height:50, width:50}} alt='logo' />
                            <p><strong>Fina Massa</strong></p>
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
                <Col md='1'/>
                <Col md='7' style={{background:'#FFF', marginTop:20, borderRadius:8, marginLeft:10, marginRight:10}}>
                    <Container style={{textAlign:'center'}}>
                        <p style={{fontSize:20, padding:10}}><strong >{tituloJanela}</strong></p>
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
                                <p><strong>Data</strong><input style={{fontWeight:'bold', marginLeft:10, width:170}} onChange={e => BuscarPedidoPorData(e.target.value)} maxLength="10" placeholder='01/01/2020'/></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0, marginBottom:10}}/>
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
                                        </Col>
                                        <Col md='4' my-auto="true" style={{textAlign:'center', padding:0, margin:0}}>
                                            <p style={{fontSize:20, width:'100%', marginBottom:5}}><strong>{Moeda(item.valor_total)}</strong></p>
                                            {
                                                item.entregue === 1 
                                                ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> FinalizarPedido(item.id, idx)} style={{background:'#47CE43', color:'#FFF', fontWeight:'bold', borderColor:'#47CE43', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }} >Reabrir</Button>
                                                : <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> FinalizarPedido(item.id, idx)} style={{background:'#FFF', color:'#F43d', fontWeight:'bold', borderColor:'#F43d', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }}>Finalizar</Button> 
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
                    <Container style={{padding:0, marginTop:0}}>

                    </Container>
                </Col>
                <Col md='1'/>
            </Row>
            <Modal show={showModal} onHide={()=> setShowModal(false)}>
                <Modal.Header closeButton/>
                <Modal.Body>
                    <Row style={{justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                        <p><strong style={{color:'#F97A7A', fontSize:20}}>Pedido: {id}</strong></p>
                        <p>Criação: <strong>{createdAt}</strong></p>
                        {
                            dt_finalizacao !== null
                            ? <p>Finalização: <strong>{dt_finalizacao}</strong></p>
                            : <p/>
                        }
                        <p><strong>{nome_cliente}</strong></p>
                        <p><strong>{telefone}</strong></p>
                        <p>Endereço:</p>
                        <p>{endereco_entrega}, {numero_entrega} {complemento_entrega}</p>
                        <p>{bairro_entrega}</p>
                        <div style={{width:'30%', height:0.5, background:'#E3E3E3', marginTop:0, marginTop:10}}/>
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
                        <p>Frete: <strong>R$5,00</strong></p>
                        <p>Total do Pedido: <strong>{valor_total}</strong></p>
                        <p>Troco Para: <strong>{troco}</strong></p>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <Button variant="danger">
                    Imprimir
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
        
    )

}

export default Dashboard