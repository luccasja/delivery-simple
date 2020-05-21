import React, {useRef, useState, useEffect} from 'react';
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/img_indisponivel.png'
import {useHistory, useLocation} from 'react-router-dom'
import { Container, Row, Col, Image, Button, Modal, Spinner} from 'react-bootstrap';
import Api from '../../services/api'
import socketIOClient from 'socket.io-client'

export default function Finalizar(){
    const [showModal, setShowModal] = useState(false)
    const [carrinho, setCarrinho] = useState([])
    const [confirmShow, setConfirmShow] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState('')
    const [loadding, setLoadding] = useState(false)
    const [pageLoadding, setPageLoadding] = useState(true)
    const [btnEnviarPedidoDisabled, setBtnEnviarPedidoDisabled] = useState(false)
    const [nome_cliente, setNomeCliente] = useState('')
    const [telefone, setTelefone]= useState('')
    const [endereco_entrega, setEnderecoEntrega] = useState('')
    const [numero_entrega, setNumeroEntrega] = useState('')
    const [bairro_entrega, setBairroEntrega] = useState('')
    const [complemento_entrega, setComplementoEntrega] = useState('')
    const [frm_pagamento, setFromPagamento] = useState('Dinheiro')
    const [qntd_item, setQtndItem] = useState(0)
    const [entregue, setEntregue] = useState(0)
    const [troco, setTroco] = useState(0)
    const [frete, setFrete] = useState(0)
    const [valor_total, setValorTotal] = useState(0)
    const [numero_pedido, setNumeroPedido] = useState(0)
    const [disabledForm, setDisabledForm] = useState(false)
    const [concluido, setConcluido] = useState(false)
    const [btnEnviarTxt, setBtnEnviarTxt] = useState('Enviar Pedido')
    const [inputBairroVisible, setInputBairroVisible] = useState(false)
    const totalRef = useRef()
    const totalPecaRef = useRef()
    const nomeClienteRef = useRef()
    const telefoneRef = useRef()
    const ruaEntregaRef = useRef()
    const numeroEntregaRef = useRef()
    const bairroSelecaoRef = useRef()
    const bairroRef = useRef()
    const frmPagamentoRef = useRef()
    const trocoRef = useRef()
    const history = useHistory()
    const location = useLocation()
    let inputRefs = []
    let totalItemRefs = []
    let nomeProdutoRefs = []
    const [serverURL, setServerURL] = useState('http://localhost:3000')
    
    
    useEffect(()=>{
        if(location.state !== null && pageLoadding){
            setCarrinho(location.state)
            if(carrinho.length === 0){
                history.replace('/pedido')
            }
        }
        setPageLoadding(false)
    },[])
    
    function handleCloseModal(){
        setShowModal(false)
    }

    function UpdateArrayIncrement(idx, ref){
        let lista = carrinho
        lista[idx].quantidade = lista[idx].quantidade+1;
        lista[idx].valor_total = lista[idx].quantidade*lista[idx].valor_unitario
        ref.textContent = lista[idx].quantidade
        setCarrinho(lista)
        totalRef.current.textContent = SomarItens(lista)
        totalPecaRef.current.textContent = SomarQntPecas(lista)
        totalItemRefs[idx].textContent = CalcularItem(idx, lista)
    }

    function UpdateArrayDecrement(idx, ref, id_produto){
        let lista = carrinho
        
        if(lista[idx].quantidade === 1){
            let nome = nomeProdutoRefs[idx].textContent
            setProdutoSelecionado({id_produto, nome}) 
            setConfirmShow(true)
            return
        }

        lista[idx].quantidade = lista[idx].quantidade-1;
        lista[idx].valor_total = lista[idx].quantidade*lista[idx].valor_unitario
        ref.textContent = lista[idx].quantidade
        setCarrinho(lista)
        totalRef.current.textContent = SomarItens(lista)
        totalPecaRef.current.textContent = SomarQntPecas(lista)
        totalItemRefs[idx].textContent = CalcularItem(idx, lista)
    }

    function ConfirmarExclusao(){
        let idx = produtoSelecionado.id_produto
        setCarrinho(carrinho.filter(item=> item.id_produto !== idx))
        setConfirmShow(false)
    }


    function CalcularItem(idx, lista){
        return Moeda(lista[idx].quantidade*lista[idx].valor_unitario)
    }

    function SomarItens(lista){
        let list = lista
        let quant = 0.0
        let preco = 0.0
        let total = 0

        list.forEach(item => {
            quant = item.quantidade
            preco = item.valor_unitario
            total = total+(quant*preco)
        });

        return Moeda(total)
    }

    function SomarItensDouble(lista){
        let list = lista
        let quant = 0.0
        let preco = 0.0
        let total = 0

        list.forEach(item => {
            quant = item.quantidade
            preco = item.valor_unitario
            total = total+(quant*preco)
        });

        return total
    }


    function SomarQntPecas(lista){
        let list = lista
        let quant = 0.0
        let total = 0

        list.forEach(item => {
            quant = item.quantidade
            total = total+quant
        });

        return total
    }

    function LimitarString(value = '', maxLength = 0){
        if(value.length > maxLength){
            return value.substring(0, maxLength)+'...'
        }
        return value
    }

    function Moeda(value){
        return Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)
    }

    function Finalizar(){
        setShowModal(true)
        setQtndItem(carrinho.length)
        setValorTotal(SomarItensDouble(carrinho))
        setQtndItem(carrinho.length)
        setEntregue(false)
    }

    function OptionsChargeBairro(value){
        if(value !== 'Outros'){
            setBairroEntrega(value)
            setInputBairroVisible(false)
            if(value === "Cidade Jardim" || value === "Popular"){
                setFrete(5)
                return
            }
            if(value === 'Selecione seu bairro'){
                setFrete(0)
            }
            return
        }
        setFrete(3)
        setBairroEntrega('')
        setInputBairroVisible(true)
    }

    function EnviarPedido(){
        if(nomeClienteRef.current.value === "" || nomeClienteRef.current.value.length < 3){
            alert('Campo nome obrigatorio')
            nomeClienteRef.current.focus()
            return
        }
        if(telefoneRef.current.value === "" || telefoneRef.current.value.length < 9){
            alert('Campo telefone obrigatorio')
            telefoneRef.current.focus()
            return
        }
        if(ruaEntregaRef.current.value === "" || ruaEntregaRef.current.value.length < 3){
            alert('Campo rua obrigatorio')
            ruaEntregaRef.current.focus()
            return
        }
        if(numeroEntregaRef.current.value === ""){
            alert('Campo numero obrigatorio')
            numeroEntregaRef.current.focus()
            return
        }
        if(bairroSelecaoRef.current.value === "Selecione seu bairro"){
            alert('Selecione seu bairro')
            bairroSelecaoRef.current.focus()
            return
        }
        if(bairroSelecaoRef.current.value === "Outros"){
            if(bairroRef.current.value === ''){
                alert('Informe seu bairro')
                bairroRef.current.focus()
                return
            }
        }

        if(frmPagamentoRef.current.textContent === ""){
            alert('Selecione uma forma de pagamento')
            frmPagamentoRef.current.focus()
            return
        }

        if(btnEnviarTxt !== 'Enviar Pedido'){
            setShowModal(false)
            history.replace('/')
            return
        }

        setFromPagamento(frmPagamentoRef.current.value)
        if(bairroSelecaoRef.current.value === 'Outros'){
            setBairroEntrega(bairroRef.current.value)
        }

        setDisabledForm(true)
        setLoadding(true)
        setBtnEnviarTxt('Enviando Pedido...')

        const pedido = {
            nome_cliente,
            telefone,
            endereco_entrega,
            numero_entrega,
            bairro_entrega,
            complemento_entrega,
            frm_pagamento,
            troco,
            frete,
            valor_total:(valor_total+frete),
            qntd_item,
            recebido:0,
            entregue,
        }


        Api.post('pedido', pedido).then(response =>{
            if(response.status === 200){
                if(response.data.id > 0){
                    setNumeroPedido(response.data.id)
                    Api.post(`pedido/${response.data.id}/item`, carrinho).then(res=>{
                        setConcluido(true)
                        setLoadding(false)
                        setBtnEnviarTxt("Ok")
                        const socket = socketIOClient(serverURL)
                        socket.emit('hasPedido', response.data.id)
                    })
                }
            }
        })
        
    }
    

    return(
        <Container>
            <Row style={{textAlign:'center', paddingBottom:10}}>
                <Col md='2'/>
                <Col md='8' style={{background:'#FFF', paddingTop:20, paddingBottom:20, borderRadius:8}}>
                    <Row>
                        <Col xs='2' >
                            <Image src={Logo} style={{height:50, width:50}} alt='logo' />
                        </Col>
                        <Col xs='8'>
                            <p className='cabecalho-titulo'><strong>Pastelaria Fina Massa</strong></p>
                            <p className='cabecalho-subtitulo'>Finalização do Pedido</p>
                        </Col>
                        <Col xs='2' ></Col>
                    </Row>
                    <Row>
                        <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:10}}/>
                    </Row>
                    <Row>
                        <Col style={{padding:0, margin:0,  overflow:'auto'}}>
                        {
                            carrinho.map((item, idx)=>{
                                return(
                                    <Row key={idx} style={{justifyContent:'center', alignItems:'center',padding:0, margin:0, borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:5, paddingBottom:5}}>
                                        <Col xs='2' my-auto="true">
                                            <Image src={Pastel} my-auto="true" roundedCircle style={{height:50, width:50}} alt='imagem do produto' />
                                        </Col>
                                        <Col xs='6' my-auto="true" style={{textAlign:'start'}}>
                                            <p><strong ref={ref =>{nomeProdutoRefs[idx] = ref}}>{item.nome}</strong></p>
                                            <p style={{fontSize:13}}>{LimitarString(item.descricao, 30)}</p>
                                            <p><strong>{Moeda(item.valor_unitario)}</strong></p>
                                            {item.observacoes !== '' 
                                                ? <p style={{fontSize:13}}><strong>Observações: </strong></p>
                                                : <p/>
                                            }
                                            {item.observacoes !== '' 
                                                ? <p style={{fontSize:13}}><span>{LimitarString(item.observacao, 30)}</span></p>
                                                : <p/>
                                            }
                                        </Col>
                                        <Col xs='4' my-auto="true">
                                            <Row>
                                                <Col xs='5' style={{padding:0}}>
                                                    <Button onClick={()=> UpdateArrayDecrement(idx, inputRefs[idx], item.id_produto)} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#707070', borderRadius:0, borderBottomLeftRadius:8, borderTopLeftRadius:8}}>
                                                        -
                                                    </Button>
                                                </Col>
                                                <Col xs='2' style={{padding:0}}>
                                                    <p ref={inputRef => {inputRefs[idx] = inputRef}}  style={{textAlign:'center', height:'100%', paddingTop:7, fontWeight:'bold', borderBottomStyle:'solid', borderTopStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                                                        {item.quantidade}
                                                    </p>
                                                </Col>
                                                <Col xs='5' style={{padding:0}}>
                                                    <Button onClick={()=> UpdateArrayIncrement(idx, inputRefs[idx])} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#F97A7A', borderRadius:0, borderBottomRightRadius:8, borderTopRightRadius:8}}>
                                                        +
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row style={{marginTop:10}}>
                                                <Col>
                                                    <p> T: <strong ref={totalItemRef => {totalItemRefs[idx] = totalItemRef}}>{Moeda(item.quantidade*item.valor_unitario)}</strong></p>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0}}/>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingBottom:10, marginBottom:10, marginTop:10}}>
                        <Button variant="danger" style={{width:250, height:50}} onClick={()=> history.replace('/pedido', carrinho)}>
                            Adicionar Mais Itens
                        </Button>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingBottom:10, marginBottom:10}}>
                        <Col>
                            <p><strong>Totais</strong></p>
                            <p><span>Itens incluso: </span><strong>{carrinho.length}</strong></p>
                            <p><span>Quantidade de Peças: </span><strong ref={totalPecaRef}>{SomarQntPecas(carrinho)}</strong></p>
                            <p><span>Subtotal: </span><strong ref={totalRef}>{SomarItens(carrinho)}</strong></p>
                        </Col>
                    </Row>
                    <Row  style={{justifyContent:'center', alignItems:'center'}}>
                        <Button variant="danger" style={{width:250, height:50}} onClick={Finalizar}>
                            Finalizar
                        </Button>
                    </Row>
                </Col>
                <Col md='2'/>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <p style={{justifyContent:'center', alignItems:'center', width:'100%'}}><strong>Finalização do Pedido</strong></p>
                </Modal.Header>
                <Modal.Body style={{padding:30}} hidden={disabledForm}>
                    <Row>
                        <Col>
                            <p><strong>Nome</strong></p>
                            <input ref={nomeClienteRef} value={nome_cliente} disabled={disabledForm} onChange={e => setNomeCliente(e.target.value)} style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:30}}>
                        <Col>
                            <p><strong>Telefone</strong></p>
                            <input ref={telefoneRef}  value={telefone} disabled={disabledForm} onChange={e => setTelefone(e.target.value)} placeholder='75 99999-9999' type='number' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:20}}>
                        <Col>
                            <p><strong>Endereço</strong></p>
                            
                            <input value={endereco_entrega} ref={ruaEntregaRef} disabled={disabledForm} onChange={e => setEnderecoEntrega(e.target.value)} placeholder='Rua' style={{width:'100%'}}/>
                            <input value={numero_entrega} ref={numeroEntregaRef} disabled={disabledForm} onChange={e => setNumeroEntrega(e.target.value)} placeholder='Número' style={{width:'100%'}}/>
                            <select ref={bairroSelecaoRef} style={{width:'100%'}} onChange={e => OptionsChargeBairro(e.target.value)}>
                                <option>Selecione seu bairro</option>
                                <option>Cidade Jardim</option>
                                <option>Popular</option>
                                <option>Outros</option>
                            </select>
                            <input value={bairro_entrega} ref={bairroRef} disabled={disabledForm} hidden={!inputBairroVisible} onChange={e => setBairroEntrega(e.target.value)} placeholder='Bairro' style={{width:'100%'}}/>
                            <input disabled={disabledForm} onChange={e => setComplementoEntrega(e.target.value)} placeholder='Complemento' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Forma de Pagamento</strong></p>
                            <select ref={frmPagamentoRef} disabled={disabledForm} onChange={e => setFromPagamento(e.target.value)} style={{width:'100%'}}>
                                <option>Dinheiro</option>
                                <option>Cartão</option>
                            </select>
                        </Col>
                    </Row>
                    <Row  style={{marginBottom:30}}>
                        <Col>
                            <p><strong>Troco Para?</strong></p>
                            <input ref={trocoRef} disabled={disabledForm} onChange={e => setTroco(e.target.value)} placeholder='0,00' type='number' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <Row>
                        <Col my-auto="true" style={{textAlign:'center'}}>
                            <p><strong>Totais</strong></p>
                            <p>Itens incluso: <strong>{carrinho.length}</strong></p>
                            <p>Quantidade de Peças: <strong>{SomarQntPecas(carrinho)}</strong></p>
                            <p><span>Frete: </span><strong>{Moeda(frete)}</strong></p>
                            <p>Total: <strong>{Moeda(SomarItensDouble(carrinho)+frete)}</strong></p>
                        </Col>
                    </Row>
                    <Row hidden={!concluido}>
                        <Container style={{padding:10, textAlign:'center', borderRadius:8}}>
                            <p style={{color:'#86E3CE'}}><strong>{nome_cliente},</strong></p>
                            <p style={{color:'#86E3CE'}}>Muito obrigado pela sua preferencia! ;)</p>
                            <p style={{color:'#86E3CE'}}>Pedido: <strong>{numero_pedido}</strong></p>
                        </Container>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="danger" style={{width:200}} onClick={EnviarPedido} disabled={btnEnviarPedidoDisabled}>
                                <Spinner animation="border" hidden={!loadding} variant="light" style={{height:20, width:20, marginRight:10}}/> 
                                <span>{btnEnviarTxt}</span>
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>

            <Modal show={confirmShow} onHide={()=>setConfirmShow(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{produtoSelecionado.nome}</Modal.Title>
                </Modal.Header>
                    <Modal.Body style={{textAlign:'center'}}>Deseja realmente excluir o item {produtoSelecionado.nome}</Modal.Body>
                    <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <Button style={{background:'#CCC', width:100, borderColor:'#FFF'}} onClick={()=> setConfirmShow(false)}>
                    Não
                </Button>
                <Button style={{background:'#F97A7A', width:100, borderColor:'#FFF'}} onClick={()=> ConfirmarExclusao()}>
                    Sim
                </Button>
                </Modal.Footer>
            </Modal>            
        </Container>
    )
};