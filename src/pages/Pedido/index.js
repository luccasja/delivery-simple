import React, {useState, useEffect} from 'react'
import Logo from '../../img/Logo.jpeg'
import img_indisponivel from '../../img/img_indisponivel.png'
import Add from '../../img/add.png'
import {useHistory, useLocation} from 'react-router-dom'
import {Button, Container, Row, Col, Image, Modal, InputGroup, FormControl} from 'react-bootstrap'
import api from '../../services/api'

import './style.css'

export default function Pedido (){
    const [showModal, setShowModal] = useState(false)
    const [id_produto, setIdProduto] = useState(0)
    const [nome, setNome] = useState('Nome do Produto')
    const [descricao, setDescricao] = useState('Descrição')
    const [valor_unitario, setValorUnitario] = useState(3)
    const [valorTotal, setValorTotal] = useState(0)
    const [quantidade, setQuantidade] = useState(1)
    const [qntItens, setQntItens] = useState(0)
    const [observacoes, setObservacoes] = useState('')
    const [carrinho, setCarrinho] = useState([])
    const [btnCarrinhoVisible, setBtnCarrinhoVisible] = useState(true)
    const [btnAddValue, setBtnAddValue] = useState(0)
    const [produtos, setProdutos] = useState([])

    const location = useLocation()
    const history = useHistory()

    useEffect(()=>{
        
        if(localStorage.getItem('@delivery/produtos') !== null){
            setProdutos(JSON.parse(localStorage.getItem('@delivery/produtos')))
        }
        
        api.get('/produto').then(response =>{
            setProdutos(response.data)
            localStorage.setItem('@delivery/produtos', JSON.stringify(response.data))
        })

        if(location.state !== undefined){
            setCarrinho(location.state)
            setValorTotal(SomarItens(location.state))
            if(location.state.length > 0){
                setBtnCarrinhoVisible(true)
            }
        }
    },[])

    function handleCloseModal(){
        setShowModal(false)
    }


    function handleIncremet(){
        if(quantidade === 20){
            alert('Quantidade maxima para o item: 20')
            return
        }

        let quant = quantidade
        quant++

        let valorUni = valor_unitario
        let novoValor = (quant*valorUni)

        setQuantidade(quant)
        setBtnAddValue(novoValor)
    }

    function handleDecremet(){
        let quant = quantidade
        if(quant===1){
            return
        }
        quant--
        let valorUni = valor_unitario
        let novoValor = (quant*valorUni)

        setQuantidade(quant)
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
        setIdProduto(item.id)
        setNome(item.nome)
        setDescricao(item.descricao)
        setValorUnitario(item.valor_unitario)
        setBtnAddValue(item.valor_unitario)
        setQuantidade(1)
        setObservacoes('')
        setShowModal(true)
    }

    function handleAdicionar(){
        let car = carrinho
        
        if(!carrinho){
            car = []
        }
        
        car.push({
            id_produto,
            nome,
            descricao,
            valor_unitario,
            quantidade,
            observacoes,
            valor_total:quantidade*valor_unitario
        })
        setQntItens(qntItens+1)
        setCarrinho(car)
        setValorTotal(SomarItens(car))
        setBtnCarrinhoVisible(true)
        setShowModal(false)
        setBtnCarrinhoVisible(true)
    }

    function SomarItens(lista){

        if(!lista){
            return 0
        }

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

    function LimitarString(value = '', maxLength = 0){
        if(value.length > maxLength){
            return value.substring(0, maxLength)+'...'
        }
        return value
    }

    function IrAoCarrinho(){
        history.replace('/finalizar', carrinho)
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
                                    produtos.map((item, idx)=>{
                                        return(
                                            <li key={idx} style={{listStyle:'none', padding:0, margin:0}}>
                                                <Row onClick={()=> ShowModal(item)} style={{justifyContent:'center', alignItems:'center',padding:0, margin:0, cursor:'pointer', borderBottomStyle:'solid', borderBottomColor:'#e3e3e3', borderBottomWidth:0.5, paddingTop:5, paddingBottom:5}}>
                                                    <Col xs='2' my-auto="true">
                                                        <Image src={img_indisponivel} roundedCircle style={{height:40, width:40, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1}} alt='imagem do produto' />
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
                                <Button  variant="danger" style={{width:300}} onClick={IrAoCarrinho}>
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
                        <Image src={img_indisponivel} roundedCircle style={{height:100, width:100, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1}} alt='Pastel de Carne' />
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p><strong>{nome}</strong></p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p>{descricao}</p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center', marginTop:15, marginBottom:15}}>
                        <p><strong>{Moeda(valor_unitario)}</strong></p>
                    </Row>
                    <Row style={{justifyContent:'center', alignItems:'center'}}>
                        <p><strong>Deseja acrescentar observações?</strong></p>
                        <InputGroup>
                            <FormControl onChange={(e)=> setObservacoes(e.target.value)} as="textarea" aria-label="With textarea" maxLength={120} height={70} style={{resize: 'none' , margin:20, marginTop:0, background:'#F5F5F5', borderColor:'#E3E3E3'}}/>
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
                                    {quantidade}
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
