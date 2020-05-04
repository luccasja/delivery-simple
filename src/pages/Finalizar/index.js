import React, {useRef, useState, useEffect} from 'react';
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/img_indisponivel.png'
import {useHistory, useLocation} from 'react-router-dom'
import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';

export default function Finalizar(){
    const [showModal, setShowModal] = useState(false)
    const [carrinho, setCarrinho] = useState([])
    const [confirmShow, setConfirmShow] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState('')
    const totalRef = useRef()
    const totalPecaRef = useRef()
    const history = useHistory()
    const location = useLocation()
    let inputRefs = []
    let totalItemRefs = []
    let nomeProdutoRefs = []
    
    useEffect(()=>{
        if(location.state != null){
            setCarrinho(location.state)
        }
    })

    
    
    function handleCloseModal(){
        setShowModal(false)
    }


    function UpdateArrayIncrement(idx, ref){
        let lista = carrinho
        
        lista[idx].qnt = lista[idx].qnt+1;
        ref.textContent = lista[idx].qnt
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
            ExcluirItem(id_produto)

            
            return
        }

        lista[idx].quantidade = lista[idx].quantidade-1;
        ref.textContent = lista[idx].quantidade
        setCarrinho(lista)
        totalRef.current.textContent = SomarItens(lista)
        totalPecaRef.current.textContent = SomarQntPecas(lista)
        totalItemRefs[idx].textContent = CalcularItem(idx, lista)

        

    }


    function ExcluirItem(idx){
        let car = carrinho
        setConfirmShow(true)
    }

    function ConfirmarExclusao(){
        

        setCarrinho(carrinho.filter(item => item.id = produtoSelecionado.id))
        setConfirmShow(false)
        console.log(carrinho)
        console.log(produtoSelecionado.id_produto)

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
                                            {item.observacao !== '' 
                                                ? <p style={{fontSize:13}}><strong>Observações: </strong></p>
                                                : <p/>
                                            }
                                            {item.observacao !== '' 
                                                ? <p style={{fontSize:13}}><span>{LimitarString(item.observacao, 30)}</span></p>
                                                : <p/>
                                            }
                                        </Col>
                                        <Col xs='4' my-auto="true">
                                            <Row>
                                                <Col xs='5' style={{padding:0}}>
                                                    <Button onClick={()=> UpdateArrayDecrement(idx, inputRefs[idx], item.id)} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#707070', borderRadius:0, borderBottomLeftRadius:8, borderTopLeftRadius:8}}>
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
                                                    <p> T: <strong ref={totalItemRef => {totalItemRefs[idx] = totalItemRef}}>{Moeda(item.qnt*item.valor)}</strong></p>
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
                        <Button variant="danger" style={{width:250, height:50}} onClick={()=> setShowModal(true)}>
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
                <Modal.Body>
                    <Row>
                        <Col>
                            <p><strong>Nome</strong></p>
                            <input style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Telefone</strong></p>
                            <input placeholder='75 99999-9999' type='number' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Endereço</strong></p>
                            <input placeholder='Rua' style={{width:'100%'}}/>
                            <input placeholder='Número' style={{width:'100%'}}/>
                            <input placeholder='Bairro' style={{width:'100%'}}/>
                            <input placeholder='Complemento' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Forma de Pagamento</strong></p>
                            <select style={{width:'100%'}}>
                                <option>Dinheiro</option>
                                <option>Cartão</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><strong>Troco Para?</strong></p>
                            <input placeholder='0,00' type='number' style={{width:'100%'}}/>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                    <Button variant="danger" style={{width:200}} onClick={()=> history.push('/')}>
                        Enviar Pedido
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={confirmShow} onHide={()=>setConfirmShow(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{produtoSelecionado.nome}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Deseja realmente excluir o item {produtoSelecionado.nome}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>setConfirmShow(false)}>
                    Não
                </Button>
                <Button variant="primary" onClick={()=> ConfirmarExclusao()}>
                    Sim
                </Button>
                </Modal.Footer>
            </Modal>            
        </Container>
    )
};
