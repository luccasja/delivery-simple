import React, {useRef, useState, useEffect, createRef} from 'react';
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/pastel.jpg'
import {useHistory} from 'react-router-dom'
import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';

export default function Finalizar(){
    const [showModal, setShowModal] = useState(false)
    let refs = useRef([createRef(),createRef(),createRef()])
    let totalref = useRef()
    let history = useHistory()

    function handleCloseModal(){
        setShowModal(false)
    }

    const [itens, setItens] = useState([
        {
            posicao:1,
            nome:'Pastel de Carne',
            descricao:'Carne, Cebola e Cheiro Verde',
            qntd:2,
            valor_unitario:3.5
        },
        {
            posicao:2,
            nome:'Pastel de Frango',
            descricao:'Frango, Cebola e Cheiro Verde',
            qntd:3,
            valor_unitario:4
        },
        {
            posicao:3,
            nome:'Kibi',
            descricao:'Carne moida, sal e açucar a gosto',
            qntd:4,
            valor_unitario:2.7
        },
    ])

    function UpdateArrayIncrement(idx, ref){
        let lista = []
        lista = itens
        
        lista[idx].qntd = lista[idx].qntd+1;
        ref.current.textContent = lista[idx].qntd
        setItens(lista)
        totalref.current.textContent = Moeda(SomarItens(lista))
    }

    function SomarItens(lista){
        let list = lista
        let quantidade = 0.0
        let preco = 0.0
        let total = 0

        list.forEach(item => {
            quantidade = item.qntd
            preco = item.valor_unitario
            total = total+(quantidade*preco)
        });

        return total
    }

    function UpdateArrayDecrement(idx, ref){
        let lista = []
        lista = itens
        
        if(lista[idx].qntd == 1){
            return
        }

        lista[idx].qntd = lista[idx].qntd-1;
        ref.current.textContent = lista[idx].qntd
        setItens(lista)
        totalref.current.textContent = Moeda(SomarItens(lista))
    }

    function Moeda(value){
        return Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)
    }

    return(
        <Container>
            <Row style={{textAlign:'center', paddingBottom:10}}>
                <Col md='2'/>
                <Col md='8' style={{background:'#FFF', padding:20, borderRadius:8}}>
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
                        <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:10, marginBottom:15}}/>
                    </Row>
                    {
                        itens.map((item, idx)=>{
                            return(
                                <Row key={item.posicao} style={{marginBottom:15, borderBottomStyle:'solid', borderBottomWidth:0.5, borderBottomColor:'#e3e3e3', paddingBottom:5}}>
                                    <Col xs='2'>
                                        <Image src={Pastel} roundedCircle style={{height:50, width:50, margin:10}} alt='Pastel de Carne' />
                                    </Col>
                                    <Col xs='6' style={{textAlign:'start'}}>
                                        <p><strong>{item.nome}</strong></p>
                                        <p style={{fontSize:13}}>{item.descricao}</p>
                                        <p><strong>{Moeda(item.valor_unitario)}</strong></p>
                                    </Col>
                                    <Col xs='4'>
                                        <Row style={{marginTop:15, marginBottom:5}}>
                                            <Col xs='5' style={{padding:0}}>
                                                <Button onClick={()=> UpdateArrayDecrement(idx, refs.current[idx])} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#707070', borderRadius:0, borderBottomLeftRadius:8, borderTopLeftRadius:8}}>
                                                    -
                                                </Button>
                                            </Col>
                                            <Col xs='2' style={{padding:0}}>
                                                <p ref={refs.current[idx]} style={{textAlign:'center', height:'100%', paddingTop:7, fontWeight:'bold', borderBottomStyle:'solid', borderTopStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3'}}>
                                                    {item.qntd}
                                                </p>
                                            </Col>
                                            <Col xs='5' style={{padding:0}}>
                                                <Button onClick={()=> UpdateArrayIncrement(idx,refs.current[idx])} style={{width:'100%',borderStyle:'solid', borderWidth:0.5, borderColor:'#e3e3e3', background:'#FFF', color:'#F97A7A', borderRadius:0, borderBottomRightRadius:8, borderTopRightRadius:8}}>
                                                    +
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    <Row style={{justifyContent:'center', alignItems:'center', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingBottom:10, marginBottom:10}}>
                        <Button variant="danger" style={{width:200}} onClick={()=> history.push('/pedido')}>
                            Adicionar Mais Itens
                        </Button>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingBottom:10, marginBottom:10}}>
                        <Col>
                            <p><strong>Totais</strong></p>
                            <p><strong>Quantidade de Itens: </strong>{itens.length}</p>
                            <p><strong>Total: </strong><p ref={totalref}>{Moeda(SomarItens(itens))}</p></p>
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
