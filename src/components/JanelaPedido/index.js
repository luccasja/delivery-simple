import React, {useState, useEffect, useRef} from 'react'
import ReactToPrint from "react-to-print"
import {useToasts} from 'react-toast-notifications'
import InputMask from 'react-input-mask'
import Api from '../../services/api'
import socketIOClient from 'socket.io-client'
import {
    Container, 
    Row, 
    Col, 
    Button, 
    Modal, 
    Spinner
} from 'react-bootstrap'
import {
    Moeda, 
    DataFormat, 
    GetFormattedDateIni, 
    GetFormattedDateFim
} from '../../controllers/Tools'
import {ModalConnection} from '../index'
import Config from '../../config/global'
import './style.css';
import ButtonCustom from '../ButtonCustom'

function JanelaPedido({hidden}) {
    const {addToast, removeToast} = useToasts()
    const [nomeEmpresa, setNomeEmpresa] = useState("Delivery Simple")
    const [pedidos, setPedidos] = useState([])
    const [pedidoLoading, setPedidoLoading] = useState(true)
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [id, setId] = useState(0)
    const [itensPedido, setItensPedido] = useState([])
    const [createdAt, setCreatedAt] = useState('')
    const [dt_finalizacao, setDtFinalizacao] = useState(null)
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [tipo_entrega, setTipoEntrega] = useState(0)
    const [endereco_entrega, setEnderecoEntrega] = useState('')
    const [numero_entrega, setNumeroEntrega] = useState('')
    const [bairro_entrega, setBairroEntrega] = useState('')
    const [complemento_entrega, setComplementoEntrega] = useState('')
    const [troco, setTroco] = useState(0)
    const [frete, setFrete] = useState(0)
    const [qntd_item, setQntdItem] = useState(0)
    const [valor_total, setValorTotal] = useState(0)
    const [nome_cliente, setNomeCliente] = useState('')
    const [frm_pagamento, setFrmPagamento] = useState('')
    const [showModal, setShowModal] = useState(false)

    //sound
    const [audio] = useState(new Audio(window.location.origin+'/sounds/Chord.mp3'))

    const listBtnRefs = []
    const pedidoRef = useRef()
    const pedidoImpRef = useRef()
    const socket = socketIOClient(Config.socketIo)

    useEffect(()=>{
        if(hidden){
            return
        }

        socket.on('hasPedido', receivedInfo=>{
            if(receivedInfo){
                addToast(`Chegou um novo pedido: ${receivedInfo}`,{ 
                    appearance: 'info', 
                    autoDismiss: true, 
                })
                if(audio.played){
                    audio.pause()
                    audio.currentTime = 0
                }
                audio.play() 
                HasPedido()
            }
        })

        Api.get('pedido/data/'+GetFormattedDateIni()+'/'+GetFormattedDateFim())
            .then(response =>{
            setPedidos(response.data)
            setPedidoLoading(false)
        }).catch(error=>{
            console.log(error)
            setPedidoLoading(false)
            setShowModalConnection(true)
            return
        })

    },[hidden])

    async function HasPedido(){
        await Api.get('pedido/data/'+GetFormattedDateIni()+'/'+GetFormattedDateFim())
            .then(response =>{
            setPedidos(response.data)
            setPedidoLoading(false)
        }).catch(error=>{
            console.log(error)
            setPedidoLoading(false)
            setShowModalConnection(true)
            return
        })
    }

    function BuscarPedido(pedido = 0){
        if(pedido === undefined || pedido === ''){
            
            Api.get('pedido/data/'+GetFormattedDateIni()+'/'+GetFormattedDateFim()).then(response =>{
                setPedidos(response.data)
                setPedidoLoading(false)
            }).catch(error=>{
                console.log(error)
                setPedidoLoading(false)
                setShowModalConnection(true)
                return
            })
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
        if(data === undefined || data === ''){
            
            Api.get('pedido/data/'+GetFormattedDateIni()+'/'+GetFormattedDateFim()).then(response =>{
                setPedidos(response.data)
                setPedidoLoading(false)
            }).catch(error=>{
                console.log(error)
                setPedidoLoading(false)
                setShowModalConnection(true)
                return
            })
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

    function AtualizarEstadoPedido(id, indice){
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
                        
                        addToast(`Pedido ${id} finalizado com sucesso!` , {
                            appearance: 'success',
                            autoDismiss: true,
                        })
                    }
                }
            }).catch(error=>{
                console.log(error)
                addToast(`Falha ao atualizar pedido ${id} para estado de finalizado! ${error.message}` , {
                    appearance: 'error',
                    autoDismiss: true,
                })
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

                        addToast(`Pedido ${id} recebido com sucesso!` , {
                            appearance: 'success',
                            autoDismiss: true,
                        })
                    }
                }
            }).catch(error=>{
                console.log(error)
                addToast(`Falha ao atualizar pedido ${id} para estado de recebido! ${error.message}` , {
                    appearance: 'error',
                    autoDismiss: true,
                })
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
        setTipoEntrega(pedido.tipo_entrega)
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

    return (
        <>
        <div hidden={hidden} className="container-janela-pedido-cmp">
            <Row style={{margin:0}}>
                <Col md='6' my-auto='true'>
                    <p>
                        <strong>Pedido</strong>
                        <InputMask 
                            mask='99999' 
                            maskChar={null} 
                            style={{fontWeight:'bold', marginLeft:10,  width:100}} 
                            onChange={e => BuscarPedido(e.target.value)} 
                            placeholder='99999'
                        />
                    </p>
                </Col>
                <Col md='6' my-auto='true'>
                    <p>
                        <strong>Data</strong>
                        <InputMask 
                            mask='99/99/9999' 
                            maskChar={null} 
                            style={{fontWeight:'bold', marginLeft:10, width:170}} 
                            onChange={e => BuscarPedidoPorData(e.target.value)} 
                            placeholder='01/01/2020'
                        />
                    </p>
                </Col>
            </Row>
            <Row style={{margin:0}}>
                <Col 
                    style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0, marginBottom:10}}
                />
            </Row>
            <Row 
                hidden={!pedidoLoading} 
                style={{margin:0, padding:0, justifyContent:'center', alignItems:'center', height:200}}>
                <Spinner 
                    animation="border" 
                    variant="info" 
                />
            </Row>
            {
                pedidos.map((item, idx) =>(
                    <div key={item.id}>
                        <Row style={{padding:0, margin:0}}>
                            <Col 
                                onClick={()=>ModalShow(item)} 
                                md='8' 
                                style={{padding:10, paddingLeft:20, cursor:'pointer'}}>
                                <p>
                                    <strong style={{color:'#F97A7A'}}>
                                        Pedido: {item.id}</strong> - <strong>
                                        {DataFormat(item.createdAt)}
                                    </strong>
                                </p>
                                <p>{item.nome_cliente} - {item.telefone}</p>
                                {
                                    item.tipo_entrega === 2
                                    ? <p>Retirada em Loja</p>
                                    : <>
                                        <p>{item.endereco_entrega}, {item.numero_entrega}, {item.bairro_entrega}</p>
                                        <p><strong>Referência: </strong>{item.complemento_entrega}</p>
                                    </> 
                                }
                                <p>Quantidade de Itens: <strong>{item.qntd_item}</strong></p>
                                {!item.recebido && <span style={{fontSize:13, height:30, background:'#199cff', color:'#FFF', padding:3, paddingLeft:10, paddingRight:10, borderRadius:3}}>Novo</span>}
                            </Col>
                            <Col md='4' my-auto="true" style={{textAlign:'center', padding:0, margin:0}}>
                                <p style={{fontSize:20, width:'100%', marginBottom:5}}><strong>{Moeda(item.valor_total)}</strong></p>
                                {
                                    item.entregue === 1 && item.recebido === 1
                                    ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> AtualizarEstadoPedido(item.id, idx)} style={{background:'#47CE43', color:'#FFF', fontWeight:'bold', borderColor:'#47CE43', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }} >Entregue</Button>
                                    : <span/>
                                }
                                {
                                    item.entregue === 0 && item.recebido === 1
                                    ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> AtualizarEstadoPedido(item.id, idx)} style={{background:'#199cff', color:'#FFF', fontWeight:'bold', borderColor:'#199cff', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }} >Finalizar</Button>
                                    : <span/>
                                } 
                                {
                                    item.entregue === 0 && item.recebido === 0
                                    ? <Button ref={ref => listBtnRefs[idx] = ref} onClick={()=> AtualizarEstadoPedido(item.id, idx)} style={{background:'#FFF', color:'#F43d', fontWeight:'bold', borderColor:'#F43d', width:150, margin:5, height:40, borderRadius:8, borderStyle:'solid', borderWidth:1 }}>Receber</Button> 
                                    : <span/>
                                }
                            </Col>
                        </Row>
                        <Row style={{margin:0}}>
                            <Col style={{width:'100%', height:0.5, background:'#E3E3E3', marginTop:0, marginBottom:10}}/>
                        </Row>
                    </div>
                    
                ))
            }
        </div>
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
                    {
                        tipo_entrega === 2
                        ? <p>Retirada em Loja</p>
                        : <>
                            <p><strong>Endereço:</strong></p>
                            <p>{endereco_entrega}, {numero_entrega}</p>
                            <p>{bairro_entrega}</p>
                            <p><strong>Referência:</strong></p>
                            <p>{complemento_entrega}</p>
                        </> 
                    }
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
                trigger={()=><ButtonCustom
                                variant="info"
                                title="Imprimir"
                                width='50%'
                            />}
                content={() => pedidoImpRef.current}
            />
            </Modal.Footer>
        </Modal>
        <ModalConnection 
            show={showModalConnection} 
            onHide={()=> setShowModalConnection(false)}
        />
        <div style={{display:'none'}}>
            <div ref={pedidoImpRef} style={{margin:0,padding:10, textAlign:'start', justifyContent:'start'}}>
                <p style={{fontSize:18, color:'#000', textAlign:'center', width:435}}>
                <strong>
                    {nomeEmpresa}
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
                {
                    tipo_entrega === 2
                    ? <p style={{fontSize:18, color:'#000'}}><strong>Retirada em Loja</strong></p>
                    : <>
                        <p style={{fontSize:18, color:'#000'}}><strong>Endereço: </strong>{endereco_entrega}, {numero_entrega}</p>
                        <p style={{fontSize:18, color:'#000'}}><strong>Bairro: </strong>{bairro_entrega}</p>
                        <p style={{fontSize:18, color:'#000', width:435}}><strong>Referência: </strong>{complemento_entrega}</p>
                    </> 
                }
                
                <p style={{color:'#000', textAlign:'center', width:435}}>
                    <strong>--------</strong>
                </p>
                <div style={{width:435, textAlign:'center'}}>
                    <Row style={{margin:0, padding:0}}>
                        {/*
                        <Col xs='1' style={{margin:0, padding:0}}>
                            Cod.
                        </Col>
                        */}
                        <Col xs='6' style={{margin:0, padding:0, textAlign:'start'}}>
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
                                {/**
                                 <Col xs='1' style={{margin:0, padding:0}}>
                                    {item.produto.id}
                                </Col>
                                    */}
                                <Col xs='6' style={{margin:0, padding:0, textAlign:'start'}}>
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

        </>
    );
}

export default JanelaPedido;