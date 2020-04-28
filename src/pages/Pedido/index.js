import React, {useState} from 'react'
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/pastel.jpg'
import Add from '../../img/add.png'
import {Button, Container, Row, Col, Image, Modal, InputGroup, FormControl} from 'react-bootstrap'

import './style.css'

export default function Pedido (){
    const [showModal, setShowModal] = useState(false)
    const [nomeProduto, setNomeProduto] = useState('Nome do Produto')
    const [descricao, setDescricao] = useState('Descrição')
    const [valor, setValor] = useState(3)
    const [valorTotal, setValorTotal] = useState(3)
    const [qnt, setQnt] = useState(1)
    const [listaProduto, setListaProduto] = useState([])

    function handleCloseModal(){
        setShowModal(false)
    }

    function handleShowModal(){
        setShowModal(true)
    }

    function handleIncremet(){
        let quantidade = qnt
        quantidade++

        let valorUnitario = valor
        let novoValor = (quantidade*valorUnitario)

        setQnt(quantidade)
        setValorTotal(novoValor)
    }

    function handleDecremet(){
        let quantidade = qnt
        if(qnt===1){
            return
        }
        quantidade--
        let valorUnitario = valor
        let novoValor = (quantidade*valorUnitario)

        setQnt(quantidade)
        setValorTotal(novoValor)
    }

    return(
        <Container>
            <Row style={{textAlign:'center', paddingBottom:10}}>
                <Col md='2'></Col>
                <Col md='8' style={{background:'#FFF', padding:20, borderRadius:8}}>
                    <Row>
                        <Col xs='2' >
                            <Image src={Logo} style={{height:50, width:50}} alt='logo' />
                        </Col>
                        <Col xs='8'>
                            <p className='cabecalho-titulo'><strong>Pastelaria Fina Massa</strong></p>
                            <p className='cabecalho-subtitulo'>Novo Pedido</p>
                        </Col>
                        <Col xs='2' ></Col>
                    </Row>
                    <Row>
                        <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:10, marginBottom:0}}/>
                    </Row>
                    <Row style={{margin:0}}>
                        <Col style={{padding:0,  overflow:'auto'}}>
                            <ul style={{padding:0, width:'96%', height:400}}>
                                <li style={{listStyle:'none'}}>
                                    <Row onClick={()=> setShowModal(true)} style={{cursor:'pointer', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:5, paddingBottom:5}}>
                                        <Col xs='3' style={{padding:5}}>
                                            <Image src={Pastel} roundedCircle style={{height:50, width:50}} alt='Pastel de Carne' />
                                        </Col>
                                        <Col xs='5' style={{ }}>
                                            <p><strong>Pastel de Carne</strong></p>
                                            <p style={{fontSize:15}}>Carne, Cebola e Cheiro Verde</p>
                                        </Col>
                                        <Col xs='2' style={{padding:15}}>
                                            <p style={{fontSize:20}}><strong>3,00</strong></p>
                                        </Col>
                                        <Col xs='2' style={{paddingTop:18}}>
                                        <Image src={Add} roundedCircle style={{height:25, width:25}} alt='Adicionar' />
                                        </Col>
                                    </Row>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col/>
                        <Col md='6'>
                            <Button style={{marginTop:10, height:45}}>
                                Ir para a Cesta R$13,00
                            </Button>
                        </Col>
                        <Col/>
                    </Row>
                </Col>
                <Col md='2'></Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton/>
                <Modal.Body>
                    <Row style={{justifyContent:'center', alignItems:'center', marginBottom:20}}>
                        <Image src={Pastel} roundedCircle style={{height:100, width:100}} alt='Pastel de Carne' />
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p><strong>{nomeProduto}</strong></p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p>{descricao}</p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', marginTop:15, marginBottom:15}}>
                        <p><strong>R$ {valor}</strong></p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p><strong>Deseja acrescentar observações?</strong></p>
                        <InputGroup>
                            <FormControl as="textarea" aria-label="With textarea" maxLength={120} height={70} style={{resize: 'none' , margin:20, marginTop:0, background:'#F5F5F5', borderColor:'#E3E3E3'}}/>
                        </InputGroup>
                    </Row>
                    <Row style={{marginTop:5, marginBottom:5}}>
                        <Col xs='3'/>
                            <Col xs='2' style={{padding:0}}>
                                <Button onClick={handleDecremet} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#707070', borderRadius:0, borderBottomLeftRadius:8, borderTopLeftRadius:8}}>
                                    -
                                </Button>
                            </Col>
                            <Col xs='2' style={{padding:0}}>
                                <p style={{textAlign:'center', height:'100%', paddingTop:7, fontWeight:'bold', borderBottomStyle:'solid', borderTopStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                                    {qnt}
                                </p>
                            </Col>
                            <Col xs='2' style={{padding:0}}>
                                <Button onClick={handleIncremet} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#F97A7A', borderRadius:0, borderBottomRightRadius:8, borderTopRightRadius:8}}>
                                    +
                                </Button>
                            </Col>
                        <Col xs='3'/>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <Button variant="danger" onClick={handleCloseModal}>
                    Adicionar R$ {valorTotal}
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
};
