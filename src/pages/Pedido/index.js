import React, {useState, useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {Container, Row, Col, Image} from 'react-bootstrap'
import Config from '../../config/global'
import Api from '../../services/api'
import PedidoController from '../../controllers/PedidoController'
import {
    HeaderCustom, 
    ItemProduto, 
    ButtonCustom, 
    ModalDetailProduto, 
    ModalConnection
} from '../../components'
import './style.css'

export default function Pedido (){
    const [nomeEmpresa, setNomeEmpresa] = useState("")
    const [tituloHeader, setTituloHeader] = useState("Novo Pedido")
    const [showModal, setShowModal] = useState(false)
    const [id_produto, setIdProduto] = useState(0)
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [valor_unitario, setValorUnitario] = useState(3)
    const [valorTotal, setValorTotal] = useState(0)
    const [quantidade, setQuantidade] = useState(1)
    const [qntItens, setQntItens] = useState(0)
    const [observacoes, setObservacoes] = useState('')
    const [carrinho, setCarrinho] = useState([])
    const [btnCarrinhoVisible, setBtnCarrinhoVisible] = useState(false)
    const [btnAddValue, setBtnAddValue] = useState(0)
    const [produtos, setProdutos] = useState([])
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [valLimItem, setValLimItem] = useState(0)
    const [valLimQntItem, setValLimQntItem] = useState(0)
    const [valMaxCar, setValMaxCar] = useState(0)
    const [inputBusca, setInputBusca] = useState('')
    const [fracionado, setFracionado] = useState(false)
    const [valQntDecimal, setValQntDecimal] = useState(0)
    const [dir_img, setDirImg] = useState(window.location.origin+"/img/img_indisponivel.png")
	const [srcLogo, setSrcLogo] = useState(window.location.origin+"/img/img_indisponivel.png")
    const pedidoCtrl = new PedidoController()
    const location = useLocation()
    const history = useHistory()

    useEffect(()=>{
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
            console.log(error)
            return
        })

        Api.get('session').then(response=>{
            if(response.status === 200){
                if(!response.data){
                    alert('A loja no momento encontra-se fechada!')
                    history.replace('/')
                }
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

        Api.get("parametro").then(response =>{
            if(response.status === 200){
                response.data.forEach(param => {
                    switch(param.nome) {
                        case "LIMITE_ITEM":
                            setValLimItem(param.valor)
                            break
                        case "LIMITE_QNT_ITEM":
                            setValLimQntItem(param.valor)
                            break
                        case "VAL_MAX_CAR":
                            setValMaxCar(param.valor)
                            break
                        case "QNT_DECIMAL":
                            setValQntDecimal(param.valor)
                            break
                    }
                })
            }
        }).catch(error=>{
            console.log(error)
            return
        })

        Api.get('/produto/ativo/1').then(response =>{
            setProdutos(response.data)
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

        if(location.state !== undefined){
            setCarrinho(location.state)
            setValorTotal(pedidoCtrl.SomarItens(location.state))
            if(location.state.length > 0){
                setBtnCarrinhoVisible(true)
            }
        }
    },[])

    function handleCloseModal(){
        setShowModal(false)
    }


    function handleIncremet(){
        if(quantidade === parseInt(valLimQntItem)){
            alert('Quantidade maxima para o item: '+valLimQntItem)
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
        if(quant <= 1){
            return
        }
        quant--
        let valorUni = valor_unitario
        let novoValor = (quant*valorUni)

        setQuantidade(quant)
        setBtnAddValue(novoValor)
    }

    function ShowModal(item){
        if(qntItens === valLimItem){
            alert('Foi atingido o limite de itens por pedido, pode prosseguir para seu carrinho.')
            return
        }
        setIdProduto(item.id)
        setNome(item.nome)
        setDescricao(item.descricao)
        setValorUnitario(item.valor_unitario)
        setBtnAddValue(item.valor_unitario)
        setDirImg(item.dir_img)
        setFracionado(item.fracionado === 1 ? true : false)
        setQuantidade(1)
        setObservacoes('')
        setShowModal(true)
    }

    function handleAdicionar(){
        let car = carrinho
        if((carrinho.length + 1) > parseInt(valLimItem)){
            alert('Quantidade maxima de item: '+valLimItem)
            return
        }
        if((pedidoCtrl.SomarDoubleItens(car)+(quantidade*valor_unitario)) > parseFloat(valMaxCar)){
            alert('Valor maximo para o carrinho: R$'+valMaxCar)
            return
        }
        
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
            valor_total:quantidade*valor_unitario,
            dir_img
        })
        setQntItens(qntItens+1)
        setCarrinho(car)
        setValorTotal(pedidoCtrl.SomarItens(car))
        setBtnCarrinhoVisible(true)
        setShowModal(false)
        setBtnCarrinhoVisible(true)
    }

    function IrAoCarrinho(){
        Api.get('session').then(response=>{
            if(response.status === 200){
                if(!response.data){
                    alert('Infelizmente não será possivel prosseguir com o pedido, pois a loja encontra-se fechada!')
                    history.replace('/')
                }
            }
        }).catch(error =>{
            console.log(error)
            setShowModalConnection(true)
            return
        })


        if(carrinho.length > 0){
            history.replace('/finalizar', carrinho)
        }else{
            alert('Seu carrinho esta vazio!')
        }
        
    }

    function OnChangeSearch(value){
        let valueFilter = value.replace('/',"")
        valueFilter = valueFilter.replace('-',"")
        valueFilter = valueFilter.replace('%',"")
        valueFilter = valueFilter.replace('&',"")
        valueFilter = valueFilter.replace('*',"")
        valueFilter = valueFilter.replace('#',"")
        valueFilter = valueFilter.replace('@',"")
        valueFilter = valueFilter.replace('!',"")
        valueFilter = valueFilter.replace('$',"")
        valueFilter = valueFilter.replace('(',"")
        valueFilter = valueFilter.replace(')',"")
        setInputBusca(valueFilter)
        if(valueFilter === ''){
            Api.get('/produto/ativo/1').then(response =>{
                setProdutos(response.data)
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }

        Api.get('produto/nomeativo/'+valueFilter).then(response=>{
            if(response.status === 200){
                setProdutos(response.data)
            }
        }).catch(error =>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function OnChangeInputQnt(value){
        if(value === ""){
            setQuantidade(0)
            setBtnAddValue(0)
            return
        }

        let quant = value
        let valorUni = valor_unitario 
        let novoValor

        for (let i = 0; i < value.length; i++) {
            if(value[i] === '.'){
                let tmp = value.substring((i+1), value.length)
                if(tmp.length > valQntDecimal){
                    quant = parseFloat(value).toFixed(valQntDecimal)
                }else{
                    quant = parseFloat(value)
                }
            }
        }

        novoValor = (quant*valorUni)
        setQuantidade(quant)
        setBtnAddValue(novoValor)
    }

    

    return(
        <Container>
            <Row style={{textAlign:'center', paddingBottom:10}}>
                <Col md='2'></Col>
                <Col md='8' className="container-central-pgpedido">
                    <HeaderCustom 
                        titulo={nomeEmpresa} 
                        subtitulo={tituloHeader}
                        srcLogo={srcLogo}
                    />
                    <Row style={{margin:0, padding:0}}>
                        <label style={{width:'100%', marginTop:5}}>
                            <input 
                                style={{width:'90%'}} 
                                placeholder="Informe aqui a sua busca"
                                value={inputBusca}
                                onChange={e => OnChangeSearch(e.target.value)}
                                maxLength={40}
                            />
                            <Image 
                                style={{height:40, width:'10%', objectFit:'contain'}} 
                                src={window.location.origin+"/img/search.png"}
                            />
                        </label>
                    </Row>
                    <Row>
                        <ul className="list-prod-pgpedido">
                            {
                                produtos.map((item, idx)=>{
                                    return(
                                        <ItemProduto
                                            key={idx} 
                                            onClick={()=> ShowModal(item)} 
                                            nome={item.nome} 
                                            descricao={item.descricao} 
                                            valorUnitario={item.valor_unitario}
                                            dir_img={item.dir_img}
                                        />
                                    )
                                })
                            }
                        </ul>
                    </Row>
                    {
                        btnCarrinhoVisible ? 
                        <ButtonCustom 
                            variant="success" 
                            onClick={IrAoCarrinho} 
                            title={"Ir para o carrinho "+valorTotal}
                            width="75%" 
                        /> : 
                        <Row style={{height:40}}/>
                    }
                    
                </Col>
                <Col md='2'></Col>
            </Row>
            <ModalDetailProduto 
                show={showModal} 
                onHide={handleCloseModal}
                onChangeTextArea={(e)=> setObservacoes(e.target.value)}
                nome={nome}
                descricao={descricao}
                valorUnitario={valor_unitario}
                onClickDecrement={handleDecremet} 
                onClickIncrement={handleIncremet}
                onClickAdicionar={handleAdicionar}
                btnAddValue={btnAddValue} 
                quantidade={quantidade}
                dir_img={dir_img}
                fracionado={fracionado}
                onChangeInputQnt={e => OnChangeInputQnt(e.target.value)}
            />
            <ModalConnection 
                show={showModalConnection} 
                onHide={()=> setShowModalConnection(false)}
            />
        </Container>
    )
};
