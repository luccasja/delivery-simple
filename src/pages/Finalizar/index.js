import React, {useRef, useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import { Container, Row, Col} from 'react-bootstrap';
import {Moeda} from '../../controllers/Tools'
import Config from '../../config/global'
import Api from '../../services/api'
import {
    ModalConnection, 
    HeaderCustom,
    ButtonCustom,
    ItemPedido,
    ModalConfirm,
    ModalFinalizarPedido
} 
from '../../components'
import './style.css'

export default function Finalizar(){
    const [nomeEmpresa, setNomeEmpresa] = useState("")
    const [integraWhatsApp, setIntegraWhatsApp] = useState(false)
    const [srcLogo, setSrcLogo] = useState(window.location.origin+"/img/img_indisponivel.png")
    const [tituloHeader, setTituloHeader] = useState("Finalização do Pedido")
    const [showModal, setShowModal] = useState(false)
    const [carrinho, setCarrinho] = useState([])
    const [confirmShow, setConfirmShow] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState('')
    const [pageLoadding, setPageLoadding] = useState(true)
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [numeroWhatsApp, setNumeroWhatsApp] = useState("")
    const [valLimItem, setValLimItem] = useState(0)
    const [valLimQntItem, setValLimQntItem] = useState(0)
    const [valMaxCar, setValMaxCar] = useState(0)
    const [valMinCpf, setValMinCpf] = useState(0)
    const [valMinFreteGratis, setValMinFreteGratis] = useState(0)
    const [pedidoWhatsDetalhado, setPedidoWhatsDetalhado] = useState(false)
    const totalRef = useRef()
    const totalPecaRef = useRef()
    const history = useHistory()
    const location = useLocation()
    let inputRefs = []
    let totalItemRefs = []
    let nomeProdutoRefs = []
    
    useEffect(()=>{
        Api.get("licenciada").then(response =>{
            if(response.status === 200){
                setNomeEmpresa(response.data[0].nome_fantasia)

                if(response.data[0].logo.length > 0){
                    setSrcLogo(Config.repositorioImg+response.data[0].logo)
                }else{
                    setSrcLogo(window.location.origin+"/img/img_indisponivel.png")
                }
                setNumeroWhatsApp(response.data[0].contato)
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

        Api.get("parametro").then(response =>{
            console.log(response.data)
            if(response.status === 200){
                response.data.forEach(param => {
                    switch(param.nome) {
                        case "INTEGRA_WHATSAPP":
                            setIntegraWhatsApp(param.valor === "1" ? true : false)
                            break
                        case "LIMITE_ITEM":
                            setValLimItem(param.valor)
                            break
                        case "LIMITE_QNT_ITEM":
                            setValLimQntItem(param.valor)
                            break
                        case "VAL_MAX_CAR":
                            setValMaxCar(param.valor)
                            break
                        case "VAL_MIN_CPF":
                            setValMinCpf(param.valor);
                            break
                        case "VAL_MIN_FRETE":
                            setValMinFreteGratis(param.valor)
                            break
                        case "PED_WHATS_DETALHADO":
                            setPedidoWhatsDetalhado(param.valor === "1" ? true : false)
                            break
                    }
                })
            }
        }).catch(error=>{
            console.log(error)
            return
        })

        Api.get('session').then(response=>{
            if(response.status === 200){
                if(!response.data){
                    alert('Infelizmente não será possivel prosseguir com o pedido, pois a loja encontra-se fechada!')
                    history.replace('/')
                    return
                }else{
                    if(location.state !== null && pageLoadding){
                        if(location.state === undefined){
                            history.replace('/pedido')
                            return
                        }
                        setCarrinho(location.state)
                    }
                }
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
        setPageLoadding(false)
    },[])
    

    function UpdateArrayIncrement(idx, ref){
        let lista = carrinho
        
        if((SomarDoubleItens(lista)+lista[idx].valor_unitario) > valMaxCar){
            alert("Valor maximo para o pedido: "+valMaxCar)
            return
        }
        if(lista[idx].quantidade+1 > valLimQntItem){
            alert("Quantidade maxima por item: "+valLimQntItem)
            return
        }
        lista[idx].quantidade = lista[idx].quantidade+1;
        lista[idx].valor_total = lista[idx].quantidade*lista[idx].valor_unitario
        ref.textContent = lista[idx].quantidade
        setCarrinho(lista)
        totalRef.current.textContent = SomarItens(lista)
        totalPecaRef.current.textContent = SomarQntPecas(lista)
        totalItemRefs[idx].textContent = CalcularItem(idx, lista)
    }

    function UpdateArrayDecrement(idx, ref){
        let lista = carrinho
        
        if(lista[idx].quantidade === 1){
            let nome = nomeProdutoRefs[idx].textContent
            setProdutoSelecionado({idx, nome}) 
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
        let idx = produtoSelecionado.idx
        let lista = []
        let listaCar = carrinho

        for (let i = 0; i < listaCar.length; i++) {
            if(i !== idx){
                lista.push(listaCar[i])
            }
        }

        setCarrinho(lista)

        if(carrinho.length === 1){
            history.replace('/pedido')
        }
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

    function SomarDoubleItens(lista){
        let list = lista
        let quant = 0.0
        let preco = 0.0
        let total = 0

        list.forEach(item => {
            quant = item.quantidade
            preco = item.valor_unitario
            total = total+(quant*preco)
        });

        return (total)
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
    
    function Finalizar(){
        Api.get('session').then(response=>{
            if(response.status === 200){
                if(!response.data){
                    alert('Infelizmente não será possivel enviar o pedido, pois a loja encontra-se fechada!')
                    history.replace('/')
                    return
                }
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

        if(carrinho.length === 0){
            alert('O pedido não possui itens!')
            history.replace('/pedido')
            return
        }

        setShowModal(true)
    }

    function ExcluirItem(idx){
        let nome = nomeProdutoRefs[idx].textContent
        setProdutoSelecionado({idx, nome}) 
        setConfirmShow(true)
    }
    
    return(
        <Container>
            <Row className="container-pgfinalizar">
                <Col md='2'/>
                <Col md='8' className="container-central-pgfinalizar">
                    <HeaderCustom 
                        titulo={nomeEmpresa} 
                        subtitulo={tituloHeader}
                        srcLogo={srcLogo}  
                    />
                    <Row>
                        <ul className="list-pedido-pgfinalizar">
                        {
                            carrinho.map((item, idx)=>{
                                return(
                                    <ItemPedido
                                        key={idx}
                                        indice={idx}
                                        nome={item.nome} 
                                        descricao={item.descricao} 
                                        valorUnitario={item.valor_unitario} 
                                        observacoes={item.observacoes} 
                                        onClickDecrement={()=> UpdateArrayDecrement(idx, inputRefs[idx])} 
                                        onClickIncrement={()=> UpdateArrayIncrement(idx, inputRefs[idx])} 
                                        onClickExcluir={() => ExcluirItem(idx)}
                                        quantidade={item.quantidade}
                                        nomeProdutoRefs={nomeProdutoRefs} 
                                        inputRefs={inputRefs}
                                        totalItemRefs={totalItemRefs}
                                        dir_img={item.dir_img}
                                    />
                                )
                            })
                        }
                        </ul>
                    </Row>
                    <ButtonCustom 
                        variant="info" 
                        title="Adicionar Mais Itens" 
                        onClick={()=> history.replace('/pedido', carrinho)}
                        width="75%"
                    />
                    <Row className="container-totais-pgfinalizar">
                        <Col>
                            <p>
                                <strong>
                                    Totais
                                </strong>
                            </p>
                            <p>
                                <span>Itens incluso: </span>
                                <strong>{carrinho.length}</strong>
                            </p>
                            <p>
                                <span>Quantidade de Peças: </span>
                                <strong ref={totalPecaRef}>
                                    {SomarQntPecas(carrinho)}
                                </strong>
                            </p>
                            <p>
                                <span>Subtotal: </span>
                                <strong ref={totalRef}>
                                    {SomarItens(carrinho)}
                                </strong>
                            </p>
                        </Col>
                    </Row>
                    <ButtonCustom 
                        variant="success" 
                        title="Finalizar" 
                        onClick={Finalizar}
                        width="75%"
                    />
                </Col>
                <Col md='2'/>
            </Row>
            <ModalFinalizarPedido 
                show={showModal} 
                onHide={()=> setShowModal(false)}
                carrinho={carrinho}
                numeroWhatsApp={numeroWhatsApp}
                valorMinCpf={valMinCpf}
                valorMinFrete={valMinFreteGratis}
                integraWhatsApp={integraWhatsApp}
                pedidoWhatsDetalhado={pedidoWhatsDetalhado}
            />
            <ModalConnection 
                show={showModalConnection} 
                onHide={()=> setShowModalConnection(false)}
            />
            <ModalConfirm 
                show={confirmShow} 
                onHide={()=>setConfirmShow(false)}
                titulo={produtoSelecionado.nome}
                texto={"Deseja realmente excluir o item "+produtoSelecionado.nome}
                onClickNegacao={()=> setConfirmShow(false)} 
                onClickConfirmacao={()=> ConfirmarExclusao()}
            />
        </Container>
    )
};