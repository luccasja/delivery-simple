import React, {useState, useRef, useEffect} from 'react';
import {useHistory, useLocation, Link} from 'react-router-dom'
import {Modal, Row, Col, Button, Container, Spinner} from 'react-bootstrap'
import Api from '../../services/api'
import socketIOClient from 'socket.io-client'
import InputMask from 'react-input-mask'
import {ValidarTelefone, Moeda, ValidarCPF} from '../../controllers/Tools'
import {ModalConnection} from '../../components'
import Config from '../../config/global'
import './style.css';

export default function ModalFinalizarPedido({
        show,
        onHide,
        carrinho,
        numeroWhatsApp,
        valorMinCpf,
        valorMinFrete,
        integraWhatsApp,
        pedidoWhatsDetalhado = false
    }) {

    const [title, setTitle] = useState("Finalização do Pedido")
    const [loadding, setLoadding] = useState(false)
    const [btnEnviarPedidoDisabled, setBtnEnviarPedidoDisabled] = useState(false)
    const [numero_pedido, setNumeroPedido] = useState(0)
    const [disabledForm, setDisabledForm] = useState(false)
    const [concluido, setConcluido] = useState(false)
    const [inputBairroVisible, setInputBairroVisible] = useState(false)
    const [trocoVisible, setTrocoVisible] = useState(true)
    const [nome_cliente, setNomeCliente] = useState('')
    const [valor_total, setValorTotal] = useState(0)
    const [telefone, setTelefone] = useState('')
    const [cpf, setCpf] = useState('')
    const [enderecoVisible, setEnderecoVisible] = useState(false)
    const [endereco_entrega, setEnderecoEntrega] = useState('')
    const [numero_entrega, setNumeroEntrega] = useState('')
    const [bairro_entrega, setBairroEntrega] = useState('')
    const [complemento_entrega, setComplementoEntrega] = useState('')
    const [frm_pagamento, setFromPagamento] = useState('Dinheiro')
    const [frete, setFrete] = useState(0)
    const [btnEnviarTxt, setBtnEnviarTxt] = useState('Enviar Pedido')
    const [troco, setTroco] = useState(0)
    const [tipo_entrega, setTipoEntrega]= useState(2)
    const [busy, setBusy] = useState(false)
    const [qntd_item, setQtndItem] = useState(0)
    const [entregue, setEntregue] = useState(0)
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [pedidoFinalizado, setPedidoFinalizado] = useState(false)
    const [bairros, setBairros] = useState([])
    const history = useHistory()
    const nomeClienteRef = useRef()
    const cpfRef= useRef()
    const telefoneRef = useRef()
    const tipoEntregaRef = useRef()
    const ruaEntregaRef = useRef()
    const numeroEntregaRef = useRef()
    const bairroSelecaoRef = useRef()
    const bairroRef = useRef()
    const complemento_entregaRef = useRef()
    const frmPagamentoRef = useRef()
    const trocoRef = useRef()

    useEffect(()=>{
        setValorTotal(SomarItensDouble(carrinho))
        setQtndItem(carrinho.length)
        setEntregue(false)
        setTrocoVisible(true)
        setTroco(0)

        Api.get("bairro")
        .then(response=>{
            if(response.status === 200){
                setBairros(response.data)
            }
        })
        .catch(erro=>{
            console.log(erro.message)
        })

    },[show])

    function OptionsChargeBairro(value){
        const {vl_frete, descricao} = JSON.parse(value)
        console.log(descricao)

        if(descricao === 'Selecione seu bairro'){
            setInputBairroVisible(false)
            setFrete(0)
            return
        }
        

        if(descricao === 'Outros'){
            setInputBairroVisible(true)
            setFrete(vl_frete)
        }else{
            setInputBairroVisible(false)
        }

        if(valor_total > valorMinFrete){
            setFrete(0)
        }else{
            setFrete(vl_frete)
        }

        setBairroEntrega('')
    }

    function OptionChargeEspecie(value){
        if(value === 'Cartão'){
            setTroco(0)
            setFromPagamento(value)
            setTrocoVisible(false)
        }else{
            setFromPagamento(value)
            setTrocoVisible(true)
            setTroco(0)
        }
    }

    function OptionChargeTipEntrega(value){
        if(value !== 'Receber em Domicílio'){
            setEnderecoVisible(false)
            setEnderecoEntrega('')
            setNumeroEntrega('')
            setBairroEntrega('')
            setComplementoEntrega('')
            setFrete(0)
            setTipoEntrega(2)
            return
        }else{
            setTipoEntrega(1)
            setEnderecoVisible(true)
            OptionsChargeBairro(bairroSelecaoRef.current.value)
        }
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

    function PedidoConcluido(){
        if(pedidoFinalizado){
            history.replace('/')
        }
    }

    function EnviarPedido(){
        
        if(busy){
            return
        }

        if(nomeClienteRef.current.value === "" || nomeClienteRef.current.value.length < 3){
            alert('Campo nome obrigatorio')
            nomeClienteRef.current.focus()
            return
        }

        if(valor_total > 50){
            if(cpfRef.current.value === "" || cpfRef.current.value.length < 14){
                alert('Campo CPF obrigatorio')
                cpfRef.current.getInputDOMNode().focus()
                return
            }
            if(!ValidarCPF(cpfRef.current.value)){
                alert('Informe um CPF válido')
                cpfRef.current.getInputDOMNode().focus()
                return
            }
        }
        
        if(telefoneRef.current.value === "" || telefoneRef.current.value.length < 9){
            alert('Campo telefone obrigatorio')
            telefoneRef.current.getInputDOMNode().focus()
            return
        }

        if(!ValidarTelefone(telefoneRef.current.value)){
            alert('Informe um numero de celular valido')
            telefoneRef.current.getInputDOMNode().focus()
            return
        }

        if(tipoEntregaRef.current.value === 'Selecione um tipo de entrega'){
            alert('Informe um tipo de entrega')
            tipoEntregaRef.current.focus()
            return
        }

        if(enderecoVisible){
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

            if(complemento_entregaRef.current.value === "" || complemento_entregaRef.current.value.length < 4){
                alert('Campo Referencia obrigatorio')
                complemento_entregaRef.current.focus()
                return
            }
        }
        if(frmPagamentoRef.current.textContent === ""){
            alert('Selecione uma forma de pagamento')
            frmPagamentoRef.current.focus()
            return
        }

        if(btnEnviarTxt !== 'Enviar Pedido'){
            history.replace('/')
            if(!integraWhatsApp){
                return
            }
            
            let messagemWhats = `*Pedido: ${numero_pedido}*%0A`
            messagemWhats += "Olá Delivery UpSales! %0A"
            messagemWhats += `${nome_cliente}%0A`
            if(pedidoWhatsDetalhado){
                carrinho.forEach((item, idx) => {
                    messagemWhats += `${idx+1}: ${item.nome} - *${item.quantidade}x* ${Moeda(item.valor_unitario)} - ${Moeda(item.valor_total)}%0A`
                    if(item.observacoes !== "" && item.observacoes !== undefined){
                        messagemWhats += `*Obs:* ${item.observacoes}%0A`
                    }
                });
            }
            messagemWhats += `Itens incluso: *${carrinho.length}*%0A`
            messagemWhats += `Quantidade de Peças: *${SomarQntPecas(carrinho)}*%0A`
            messagemWhats += `Frete: *${Moeda(frete)}*%0A`
            messagemWhats += `Valor: *${Moeda(SomarItensDouble(carrinho)+frete)}*%0A`
            messagemWhats += `Troco Para: *${Moeda(troco)}*%0A`
            messagemWhats += `${window.location.origin}/pb/${numero_pedido}%0A`
            window.open(`https://api.whatsapp.com/send?phone=55${numeroWhatsApp}&text=${messagemWhats}&source=&data=&app_absent=`)
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
            cpf,
            telefone,
            tipo_entrega,
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

        setBusy(true)
        Api.post('pedido', pedido).then(response =>{
            if(response.status === 200){
                if(response.data.id > 0){
                    setNumeroPedido(response.data.id)
                    Api.post(`pedido/${response.data.id}/item`, carrinho).then(res=>{
                        setConcluido(true)
                        setLoadding(false)
                        setBtnEnviarTxt("Ok")
                        const socket = socketIOClient(Config.socketIo)
                        socket.emit('hasPedido', response.data.id)
                        setPedidoFinalizado(true)
                        setBusy(false)
                    })
                }
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
        
    }

    return (
        <>
        <Modal show={show} onHide={onHide} onExit={PedidoConcluido}>
            <Modal.Header closeButton>
                <p className="header-modal-finalizar-pedido">
                    <strong>
                        {title}
                    </strong>
                </p>
            </Modal.Header>
            <Modal.Body 
                className="body-modal-finalizar-pedido" 
                hidden={disabledForm}>
                <Row>
                    <Col>
                        <p><strong>Nome</strong></p>
                        <input 
                            ref={nomeClienteRef} 
                            value={nome_cliente} 
                            disabled={disabledForm} 
                            onChange={e => setNomeCliente(e.target.value)} 
                            maxLength={80} 
                            className="size-input-finalizar-pedido"
                        />
                        {
                            (valor_total > valorMinCpf) &&
                            <div>
                                <p><strong>CPF</strong></p>
                                <InputMask 
                                    mask="999.999.999-99" 
                                    maskChar={null} 
                                    placeholder="000.000.000-00" 
                                    ref={cpfRef} 
                                    value={cpf} 
                                    disabled={disabledForm} 
                                    onChange={e => setCpf(e.target.value)} 
                                    className="size-input-finalizar-pedido"
                                />
                            </div>  
                        }
                    </Col>
                </Row>
                <Row style={{marginBottom:30}}>
                    <Col>
                        <p><strong>Telefone</strong></p>
                        <InputMask 
                            mask='(99) 99999-9999' 
                            maskChar={null} 
                            ref={telefoneRef}  
                            value={telefone} 
                            disabled={disabledForm} 
                            onChange={e => setTelefone(e.target.value)} 
                            placeholder='(75) 99999-9999' 
                            className="size-input-finalizar-pedido"
                        />
                    </Col>
                </Row>
                <Row style={{marginBottom:30}}>
                    <Col>
                        <p><strong>Tipo de Entrega</strong></p>
                        <select 
                            ref={tipoEntregaRef} 
                            className="size-input-finalizar-pedido" 
                            disabled={disabledForm} 
                            onChange={e => OptionChargeTipEntrega(e.target.value)}>
                            <option>Selecione um tipo de entrega</option>
                            <option>Retirar em Loja</option>
                            <option>Receber em Domicílio</option>
                        </select>
                    </Col>
                </Row>
                <Row hidden={!enderecoVisible} style={{marginBottom:20}}>
                    <Col>
                        <p><strong>Endereço</strong></p>
                        <input 
                            value={endereco_entrega} 
                            ref={ruaEntregaRef} 
                            disabled={disabledForm} 
                            onChange={e => setEnderecoEntrega(e.target.value)} 
                            maxLength={80} 
                            placeholder='Rua' 
                            className="size-input-finalizar-pedido"
                        />
                        <input 
                            value={numero_entrega} 
                            ref={numeroEntregaRef} 
                            disabled={disabledForm} 
                            onChange={e => setNumeroEntrega(e.target.value)} 
                            maxLength={80} 
                            placeholder='Número' 
                            className="size-input-finalizar-pedido"
                        />
                        <select 
                            ref={bairroSelecaoRef}
                            className="size-input-finalizar-pedido" 
                            onChange={e => OptionsChargeBairro(e.target.value)}>
                            <option 
                                value={JSON.stringify({
                                    vl_frete: 0, 
                                    descricao: "Selecione seu bairro"
                                })}>
                                    Selecione seu bairro
                            </option>
                            {
                                bairros.map(bairro=>{
                                    return(
                                        <option 
                                            key={bairro.id} 
                                            value={JSON.stringify({
                                                vl_frete: bairro.frete, 
                                                descricao: bairro.descricao
                                            })}>
                                                {bairro.descricao}
                                        </option>
                                    )
                                })
                            }
                        </select>
                        <input 
                            value={bairro_entrega} 
                            ref={bairroRef} 
                            disabled={disabledForm} 
                            hidden={!inputBairroVisible} 
                            onChange={e => setBairroEntrega(e.target.value)} 
                            placeholder='Bairro' 
                            maxLength={30} 
                            className="size-input-finalizar-pedido"
                        />
                        <input 
                            disabled={disabledForm} 
                            ref={complemento_entregaRef} 
                            onChange={e => setComplementoEntrega(e.target.value)} 
                            placeholder='Referência' 
                            maxLength={100} 
                            className="size-input-finalizar-pedido"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><strong>Forma de Pagamento</strong></p>
                        <select 
                            ref={frmPagamentoRef} 
                            disabled={disabledForm} 
                            onChange={e => OptionChargeEspecie(e.target.value)} 
                            className="size-input-finalizar-pedido">
                            <option>Dinheiro</option>
                            <option>Cartão</option>
                        </select>
                    </Col>
                </Row>
                <Row hidden={!trocoVisible} style={{marginBottom:30}}>
                    <Col>
                        <p><strong>Troco Para?</strong></p>
                        <input 
                            ref={trocoRef} 
                            disabled={disabledForm} 
                            onChange={e => setTroco(e.target.value)} 
                            placeholder='0,00' 
                            maxLength={6} 
                            type='number' 
                            className="size-input-finalizar-pedido"
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="footer-modal-finalizar-pedido">
                <Row>
                    <Col 
                        my-auto="true" 
                        className="totais-modal-finalizar-ped">
                        <p>
                            <strong>Totais</strong>
                        </p>
                        <p>
                            <span>Itens incluso: </span>
                            <strong>
                                {carrinho.length}
                            </strong>
                        </p>
                        <p>
                            <span>Quantidade de Peças: </span>
                            <strong>
                                {SomarQntPecas(carrinho)}
                            </strong>
                        </p>
                        <p>
                            <span>Frete: </span>
                            <strong>
                                {Moeda(frete)}
                            </strong>
                        </p>
                        <p>
                            <span>Total: </span>
                            <strong>
                                {Moeda(SomarItensDouble(carrinho)+frete)}
                            </strong>
                        </p>
                    </Col>
                </Row>
                <Row hidden={!concluido}>
                    <Container className="agradecimentos-modal-finalizar-pedido">
                        <p style={{color:'#86E3CE'}}><strong>{nome_cliente},</strong></p>
                        <p style={{color:'#86E3CE'}}>Muito obrigado pela sua preferência! ;)</p>
                        <p style={{color:'#86E3CE'}}>Pedido: <strong>{numero_pedido}</strong></p>
                        <p style={{color:'#86E3CE'}}>---</p>
                        <p><strong>Tempo de espera:</strong></p>
                        <p><strong>Para entrega a domicílio </strong>estimativa de 30 minutos a 1h, 
                                                    podendo ser mais rapido em dias de semana.</p>
                        <p><strong>Para retirada em loja, </strong>entre 20 a 30 minutos.</p>
                    </Container>
                </Row>
                <Row>
                    <Col>
                        
                        <Button 
                            variant="success" 
                            className="btn-enviar-pedido-modal-finalizar" 
                            onClick={EnviarPedido} 
                            disabled={btnEnviarPedidoDisabled}>
                            <Spinner 
                                animation="border" 
                                hidden={!loadding} 
                                variant="light" 
                                className="load-enviar-pedido-modal-finalizar"
                            /> 
                            <span>{btnEnviarTxt}</span>
                        </Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
        <ModalConnection 
            show={showModalConnection} 
            onHide={()=> setShowModalConnection(false)}
        />
        </>
    );
}