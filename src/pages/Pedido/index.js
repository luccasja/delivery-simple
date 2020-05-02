import React, {useState, useRef, createRef, useEffect} from 'react'
import Logo from '../../img/Logo.jpeg'
import Pastel from '../../img/img_indisponivel.png'
import Add from '../../img/add.png'
import {useHistory, useLocation} from 'react-router-dom'
import {Button, Container, Row, Col, Image, Modal, InputGroup, FormControl} from 'react-bootstrap'

import './style.css'

export default function Pedido (){
    const [showModal, setShowModal] = useState(false)
    const [nomeProduto, setNomeProduto] = useState('Nome do Produto')
    const [descricao, setDescricao] = useState('Descrição')
    const [valor, setValor] = useState(3)
    const [valorTotal, setValorTotal] = useState(0)
    const [qnt, setQnt] = useState(1)
    const [qntItens, setQntItens] = useState(0)
    const [observacao, setObservacao] = useState('')
    const [carrinho, setCarrinho] = useState([])
    const [btnCarrinhoVisible, setBtnCarrinhoVisible] = useState(false)
    const [btnAddValue, setBtnAddValue] = useState(0)
    const location = useLocation()
    const history = useHistory()

    useEffect(()=>{
        if(location.state != null){
            let car = carrinho
            setValorTotal(SomarItens(car))
            setBtnCarrinhoVisible(true)
            setCarrinho(location.state)
        }
    },[carrinho])

    const [itens, setItens] = useState([
        {
            posicao:1,
            nome:'Pastel de Carne',
            descricao:'Carne, Cebola e Cheiro Verde',
            valor_unitario:3.5
        },
        {
            posicao:2,
            nome:'Pastel de Frango',
            descricao:'Frango, Cebola e Cheiro Verde',
            valor_unitario:4
        },
        {
            posicao:3,
            nome:'Kibi',
            descricao:'Carne moida, sal e açucar a gosto',
            valor_unitario:2.7
        },
        {
            posicao:4,
            nome:'Pão de Queijo',
            descricao:'Queijo e oregano',
            valor_unitario:0.5
        },
        {
            posicao:5,
            nome:'Pastel de Forma',
            descricao:'Frango e demais ingredientes',
            valor_unitario:2.7
        },
        {
            posicao:6,
            nome:'Pastel de Forma',
            descricao:'Frango e demais ingredientes',
            valor_unitario:2.7
        },
        {
            posicao:7,
            nome:'Pastel de Forma',
            descricao:'Frango e demais ingredientes',
            valor_unitario:2.7
        }
    ])


    function handleCloseModal(){
        setShowModal(false)
    }


    function handleIncremet(){
        if(qnt === 20){
            alert('Quantidade maxima para o item: 20')
            return
        }

        let quantidade = qnt
        quantidade++

        let valorUnitario = valor
        let novoValor = (quantidade*valorUnitario)

        setQnt(quantidade)
        setBtnAddValue(novoValor)
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
        setBtnAddValue(novoValor)
    }

    function Moeda(value){
        return Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)
    }

    function ShowModal(item){
        if(qntItens === 20){
            alert('Foi atingido o limite de itens por pedido, pode prosseguir para seu carrinho.')
            return
        }
        setNomeProduto(item.nome)
        setDescricao(item.descricao)
        setValor(item.valor_unitario)
        setBtnAddValue(item.valor_unitario)
        setQnt(1)
        setObservacao('')
        setShowModal(true)
    }

    function handleAdicionar(){
        let car = carrinho
        car.push({
            nomeProduto,
            descricao,
            valor,
            qnt,
            observacao
        })
        setQntItens(qntItens+1)
        setCarrinho(car)
        setValorTotal(SomarItens(car))
        setBtnCarrinhoVisible(true)
        setShowModal(false)
        setBtnCarrinhoVisible(true)
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

        return Moeda(total)
    }

    function LimitarString(value = '', maxLength = 0){
        if(value.length > maxLength){
            return value.substring(0, maxLength)+'...'
        }
        return value
    }

    return(
        <Container>
            <Row style={{textAlign:'center', paddingBottom:10}}>
                <Col md='2'></Col>
                <Col md='8' style={{background:'#FFF', paddingTop:20, paddingBottom:20, borderRadius:8}}>
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
                    <Row>
                        <Col style={{padding:0, margin:0,  overflow:'auto'}}>
                            <ul style={{padding:0, margin:0, width:'100%', height:400}}>
                                {
                                    itens.map((item, idx)=>{
                                        return(
                                            <li key={idx} style={{listStyle:'none', padding:0, margin:0}}>
                                                <Row onClick={()=> ShowModal(item)} style={{justifyContent:'center', alignItems:'center',padding:0, margin:0, cursor:'pointer', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:5, paddingBottom:5}}>
                                                    <Col xs='2' my-auto="true">
                                                        <Image src={Pastel} roundedCircle style={{height:40, width:40, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1}} alt='imagem do produto' />
                                                    </Col>
                                                    <Col xs='6' my-auto="true" style={{textAlign:'start', padding:0, margin:0}}>
                                                        <p><strong>{item.nome}</strong></p>
                                                        <p style={{fontSize:13}}>{LimitarString(item.descricao, 30)}</p>
                                                    </Col>
                                                    <Col xs='3' my-auto="true" style={{padding:0, margin:0}}>
                                                        <p style={{fontSize:20}}><strong>{Moeda(item.valor_unitario)}</strong></p>
                                                    </Col>
                                                    <Col xs='1' my-auto="true" style={{padding:0, margin:0}}>
                                                        <Image src={Add} roundedCircle style={{height:20, width:20}} alt='Adicionar' />
                                                    </Col>
                                                </Row>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{width:'100%', height:0.5, background:'#F3B442', marginTop:0, marginBottom:10}}/>
                    </Row>
                    {
                        btnCarrinhoVisible ? 
                        <Row>
                            <Col/>
                            <Col md='8'>
                                <Button  variant="danger" style={{width:300}} onClick={()=> history.replace('/finalizar', carrinho)}>
                                    Ir para o Carrinho <span>{valorTotal}</span>
                                </Button>
                            </Col>
                            <Col/>
                        </Row> :
                        <Row style={{height:40}}/>
                    }
                    
                </Col>
                <Col md='2'></Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton/>
                <Modal.Body>
                    <Row style={{justifyContent:'center', alignItems:'center', marginBottom:20}}>
                        <Image src={Pastel} roundedCircle style={{height:100, width:100, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1}} alt='Pastel de Carne' />
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p><strong>{nomeProduto}</strong></p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p>{descricao}</p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', marginTop:15, marginBottom:15}}>
                        <p><strong>{Moeda(valor)}</strong></p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p><strong>Deseja acrescentar observações?</strong></p>
                        <InputGroup>
                            <FormControl onChange={(e)=> setObservacao(e.target.value)} as="textarea" aria-label="With textarea" maxLength={120} height={70} style={{resize: 'none' , margin:20, marginTop:0, background:'#F5F5F5', borderColor:'#E3E3E3'}}/>
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
                <Button variant="danger" onClick={handleAdicionar}>
                    Adicionar {Moeda(btnAddValue)}
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
};
