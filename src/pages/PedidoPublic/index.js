import React, {useRef, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {Moeda, DataFormat, parseQueryString} from '../../controllers/Tools'
import {Row, Container, Navbar, Image, Badge, ProgressBar} from 'react-bootstrap'
import Api from '../../services/api'
import Config from '../../config/global'
import './style.css';

function PedidoPublic() {
    //const [id, setId] = useState(0)
    const [nomeEmpresa, setNomeEmpresa] = useState(" ")
    const [progressBar, setProgressBar] = useState(0)
    const [progressBarVisible, setProgressBarVisible] = useState(true)
    const [srcLogo, setSrcLogo] = useState(window.location.origin+"/img/img_indisponivel.png")
    const [idPedido, setIdPedido] = useState(0)
    const [createdAt, setCreatedAt] = useState("")
    const [dtFinalizacao, setDtFinalizacao] = useState("")
    const [nomeCliente, setNomeCliente] = useState("")
    const [cpf, setCpf] = useState("")
    const [telefone, setTelefone] = useState("")
    const [tipoEntrega, setTipoEntrega] = useState(2)
    const [numeroEntrega, setNumeroEntrega] = useState("")
    const [enderecoEntrega, setEnderecoEntrega] = useState("")
    const [bairroEntrega, setBairroEntrega] = useState("")
    const [complementoEntrega, setComplementoEntrega] = useState("")
    const [itensPedido, setItensPedido] = useState([])
    const [qntdItem, setQntdItem] = useState(0)
    const [frmPagamento, setFrmPagamento] = useState("")
    const [frete, setFrete] = useState("")
    const [valorTotal, setValorTotal] = useState(0)
    const [troco, setTroco] = useState(0)
    const [semResultadoVisible, setSemResultadoVisible] = useState(false)
    const [pedidoVisible, setPedidoVisible] = useState(false)
    const [recebido, setRecebido] = useState(0)
    const [entregue, setEntregue] = useState(0)
    const {id} = useParams()

    useEffect(()=>{
        setProgressBar(1)
        //var params = parseQueryString();
        
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
            setProgressBarVisible(false)
            console.log(error)
            return
        })
        setProgressBar(35)
        Api.get("pedido/"+id)
        .then(response =>{
            if(response.status === 200){
                if(response.data !== ""){
                    setIdPedido(response.data.id)
                    setBairroEntrega(response.data.bairro_entrega)
                    setComplementoEntrega(response.data.complemento_entrega)
                    setCpf(response.data.cpf)
                    setCreatedAt(DataFormat(response.data.createdAt))
                    setDtFinalizacao(DataFormat(response.data.dt_finalizacao))
                    setEnderecoEntrega(response.data.endereco_entrega)
                    setFrete(response.data.frete)
                    setFrmPagamento(response.data.frm_pagamento)
                    setNomeCliente(response.data.nome_cliente)
                    setNumeroEntrega(response.data.numero_entrega)
                    setQntdItem(response.data.qntd_item)
                    setTelefone(response.data.telefone)
                    setTipoEntrega(response.data.tipo_entrega)
                    setTroco(response.data.troco)
                    setValorTotal(response.data.valor_total)
                    setEntregue(response.data.entregue)
                    setRecebido(response.data.recebido)
                    setPedidoVisible(true)
                    setSemResultadoVisible(false)
                }else{
                    setSemResultadoVisible(true)
                    setPedidoVisible(false)
                }
            }
        })
        .catch(error =>{
            console.log(error.message)
            setProgressBarVisible(false)
            setSemResultadoVisible(true)
        })
        setProgressBar(70)
        Api.get("pedido/"+id+"/item")
        .then(response =>{
            if(response.status === 200){
                if(response.data.length > 0){
                    setItensPedido(response.data)
                    setSemResultadoVisible(false)
                }else{
                    setSemResultadoVisible(true)
                    setPedidoVisible(false)
                }
            }
        })
        .catch(error =>{
            console.log(error.message)
            setSemResultadoVisible(true)
            setProgressBarVisible(false)
        })
        setProgressBar(100)
        setProgressBarVisible(false)
    },[])

    return( 
    <div style={{width:"100%", padding:20}}>
        <Navbar style={{textAlign:'center', justifyContent:"center"}} fixed="top" bg="dark">
            <Navbar.Brand>
                <span style={{color:"#FFF"}}>
                    {nomeEmpresa}
                </span>
            </Navbar.Brand>
        </Navbar>
        <Row hidden={!progressBarVisible}>
            <ProgressBar variant="success" animated now={progressBar} style={{marginTop:55, width:"100%", height:10}}/>
        </Row>
        <Row hidden={!pedidoVisible} style={{margin:0, marginTop:70, padding:0, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Image style={{height:70, width:70, objectFit:"cover"}} roundedCircle src={srcLogo}/>
        </Row>
        <Container hidden={!semResultadoVisible} style={{display:"flex", justifyContent:"center", alignItems:"center", height:400}}>
            <p>
                <strong>Pedido {id} não encontrado!</strong>
            </p>
        </Container>
        <div>
            <Row hidden={!pedidoVisible} style={{justifyContent:'center', alignItems:'center', flexDirection:'column', margin:0, padding:0, marginTop:20}}>
                <p><strong style={{color:'#F97A7A', fontSize:20}}>Pedido: {idPedido}</strong></p>
                <p>Criação: <strong>{createdAt}</strong></p>
                {
                    dtFinalizacao !== null
                    ? <p>Finalização: <strong>{dtFinalizacao}</strong></p>
                    : <p/>
                }
                <p><strong>{nomeCliente}</strong></p>
                {
                    cpf !== '' && 
                    <p><strong>CPF: </strong>{cpf}</p>
                }
                <p><strong>{telefone}</strong></p>
                {
                    tipoEntrega === 2
                    ? <p>Retirada em Loja</p>
                    : <>
                        <p><strong>Endereço:</strong></p>
                        <p>{enderecoEntrega}, {numeroEntrega}</p>
                        <p>{bairroEntrega}</p>
                        <p><strong>Referência:</strong></p>
                        <p>{complementoEntrega}</p>
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
                <p>Itens incluso: <strong>{qntdItem}</strong></p>
                <p>Forma de Pagamento: <strong>{frmPagamento}</strong></p>
                <p>Frete: <strong>{Moeda(frete)}</strong></p>
                <p>Total do Pedido: <strong>{Moeda(valorTotal)}</strong></p>
                <p>Troco Para: <strong>{Moeda(troco)}</strong></p>
            </Row>
        </div>
        <Row hidden={!pedidoVisible} style={{display:"flex", justifyContent:"center", marginTop:20}}>
            <h4>
                {recebido === 0 && entregue === 0 && <Badge variant="info">Novo</Badge>}
                {recebido === 1 && entregue === 0 && <Badge variant="primary">Recebido</Badge>}
                {recebido === 1 && entregue === 1 && <Badge variant="success">Entregue</Badge>}
            </h4>
        </Row>
    </div>
    )
}

export default PedidoPublic;