import React, {useRef, useState, useEffect} from 'react';
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/img_indisponivel.png'
import {useHistory, useLocation} from 'react-router-dom'
import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';

export default function Finalizar(){
    const [showModal, setShowModal] = useState(false)
    const [carrinho, setCarrinho] = useState([])
    const totalref = useRef()
    const history = useHistory()
    const location = useLocation()
    let refsArray = [];
    
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
        totalref.current.textContent = Moeda(SomarItens(lista))
    }

    function SomarItens(lista){
        let list = lista
        let quantidade = 0.0
        let preco = 0.0
        let total = 0

        list.forEach(item => {
            quantidade = item.qnt
            preco = item.valor
            total = total+(quantidade*preco)
        });

        return total
    }

    function UpdateArrayDecrement(idx, ref){
        let lista = carrinho
        
        if(lista[idx].qnt === 1){
            return
        }

        lista[idx].qnt = lista[idx].qnt-1;
        ref.textContent = lista[idx].qnt
        setCarrinho(lista)
        totalref.current.textContent = Moeda(SomarItens(lista))
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
                                    <Row key={idx} style={{justifyContent:'center', alignItems:'center',padding:0, margin:0, cursor:'pointer', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:5, paddingBottom:5}}>
                                        <Col xs='2' my-auto="true">
                                            <Image src={Pastel} my-auto="true" roundedCircle style={{height:50, width:50}} alt='imagem do produto' />
                                        </Col>
                                        <Col xs='6' my-auto="true" style={{textAlign:'start'}}>
                                            <p><strong>{item.nomeProduto}</strong></p>
                                            <p style={{fontSize:13}}>{item.descricao}</p>
                                            <p><strong>{Moeda(item.valor)}</strong></p>
                                        </Col>
                                        <Col xs='4' my-auto="true">
                                            <Row>
                                                <Col xs='5' style={{padding:0}}>
                                                    <Button onClick={()=> UpdateArrayDecrement(idx, refsArray[idx])} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#707070', borderRadius:0, borderBottomLeftRadius:8, borderTopLeftRadius:8}}>
                                                        -
                                                    </Button>
                                                </Col>
                                                <Col xs='2' style={{padding:0}}>
                                                    <p ref={ref => {refsArray[idx] = ref;}}  style={{textAlign:'center', height:'100%', paddingTop:7, fontWeight:'bold', borderBottomStyle:'solid', borderTopStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                                                        {item.qnt}
                                                    </p>
                                                </Col>
                                                <Col xs='5' style={{padding:0}}>
                                                    <Button onClick={()=> UpdateArrayIncrement(idx, refsArray[idx])} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#F97A7A', borderRadius:0, borderBottomRightRadius:8, borderTopRightRadius:8}}>
                                                        +
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                        </Col>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingBottom:10, marginBottom:10, marginTop:10}}>
                        <Button variant="danger" style={{width:200}} onClick={()=> history.push('/pedido', location.state)}>
                            Adicionar Mais Itens
                        </Button>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingBottom:10, marginBottom:10}}>
                        <Col>
                            <p><strong>Totais</strong></p>
                            <p><strong>Quantidade de Itens: </strong>{carrinho.length}</p>
                            <p><strong>Total: </strong><span ref={totalref}>{Moeda(SomarItens(carrinho))}</span></p>
                        </Col>
                    </Row>
                    <Row  style={{justifyContent:'center', alignItems:'center'}}>
                        <Button variant="danger" style={{width:200}} onClick={()=> setShowModal(true)}>
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
        </Container>
    )
};
