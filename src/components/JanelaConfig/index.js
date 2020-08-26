import React, {useState, useEffect, useRef} from 'react'
import {Accordion, Card} from 'react-bootstrap'
import {Switch, ItemConfig} from '../../components'
import Api from '../../services/api'
import './style.css';

function JanelaConfig({hidden}) {
    const [switchWhatsApp, setSwitchWhatsApp] = useState(false)
    const [switchWhatsAppDesabled, setSwitchWhatsAppDesabled] = useState(false)
    const [switchCodProdImp, setSwitchCodProdImp] = useState(false)
    const [switchCodProdImpDesabled, setSwitchCodProdImpDesabled] = useState(false)
    const [switchPedidoWhatsDetalhado, setSwitchPedidoWhatsDetalhado] = useState(false)
    const [switchPedidoWhatsDetalhadoDesabled, setSwitchPedidoWhatsDetalhadoDesabled] = useState(false)
    const [valMinCpf, setValMinCpf] = useState(0)
    const [valMinCpfDesabled, setValMinCpfDesabled] = useState(true)
    const [valQntDecimal, setValQntDecimal] = useState(0)
    const [valQntDecimalDesabled, setValQntDecimalDesabled] = useState(true)
    const [valLimItem, setValLimItem] = useState(0)
    const [valLimItemDesabled, setValLimItemDesabled] = useState(true)
    const [valLimQntItem, setValLimQntItem] = useState(0)
    const [valLimQntItemDesabled, setValLimQntItemDesabled] = useState(true)
    const [valMaxCar, setValMaxCar] = useState(0)
    const [valMaxCarDesabled, setValMaxCarDesabled] = useState(true)
    const [valMinFreteGratis, setValMinFreteGratis] = useState(0)
    const [valMinFreteGratisDesabled, setValMinFreteDesabled] = useState(true)
    const valMinCpfBtnRef = useRef()
    const valQntDecimalBtnRef = useRef()
    const valLimItemBtnRef = useRef()
    const valLimQntItemBtnRef = useRef()
    const valMaxCarBtnRef = useRef()
    const valMinFreteGratisBtnRef = useRef()

    useEffect(()=>{
        if(hidden){
            return
        }
        Api.get("parametro").then(response =>{
            console.log(response.data)
            if(response.status === 200){
                response.data.forEach(param => {
                    switch(param.nome) {
                        case "INTEGRA_WHATSAPP":
                            setSwitchWhatsApp(param.valor === "1" ? true : false)
                            break
                        case "COD_PROD_IMP":
                            setSwitchCodProdImp(param.valor === "1" ? true : false)
                            break
                        case "VAL_MIN_CPF":
                            setValMinCpf(param.valor);
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
                        case "VAL_MIN_FRETE":
                            setValMinFreteGratis(param.valor)
                            break
                        case "QNT_DECIMAL":
                            setValQntDecimal(param.valor)
                            break
                        case "PED_WHATS_DETALHADO":
                            setSwitchPedidoWhatsDetalhado(param.valor === "1" ? true : false)
                            break
                        default:
                          // code block
                    }
                })
            }
        }).catch(error=>{
            console.log(error)
            return
        })
    },[hidden])

    function HandlerSwitchWhatsApp(){
        setSwitchWhatsAppDesabled(true)
        Api.put("parametro/INTEGRA_WHATSAPP",{
            valor:!switchWhatsApp
        }).then(response=>{
            if(response.status === 200){
                setSwitchWhatsApp(!switchWhatsApp)
                setSwitchWhatsAppDesabled(false)
            }
        }).catch(erro=>{
            alert("Falha na atualização do parametro Integra WhatsApp: "+erro.message)
            setSwitchWhatsApp(switchWhatsApp)
            setSwitchWhatsAppDesabled(false)
        })
    }

    function HandlerSwitchPedidoWhatsDetalhado(){
        setSwitchPedidoWhatsDetalhadoDesabled(true)
        Api.put("parametro/PED_WHATS_DETALHADO",{
            valor:!switchPedidoWhatsDetalhado
        }).then(response=>{
            if(response.status === 200){
                setSwitchPedidoWhatsDetalhado(!switchPedidoWhatsDetalhado)
                setSwitchPedidoWhatsDetalhadoDesabled(false)
            }
        }).catch(erro=>{
            alert("Falha na atualização do parametro PED_WHATS_DETALHADO: "+erro.message)
            setSwitchPedidoWhatsDetalhado(switchPedidoWhatsDetalhado)
            setSwitchPedidoWhatsDetalhadoDesabled(false)
        })
    }

    function HandlerSwitchCodProdImp(){
        setSwitchCodProdImpDesabled(true)
        Api.put("parametro/COD_PROD_IMP",{
            valor:!switchCodProdImp
        }).then(response=>{
            if(response.status === 200){
                setSwitchCodProdImp(!switchCodProdImp)
                setSwitchCodProdImpDesabled(false)
            }
        }).catch(erro=>{
            alert("Falha na atualização do parametro CodProdImp: "+erro.message)
            setSwitchCodProdImp(switchCodProdImp)
            setSwitchCodProdImpDesabled(false)
        })
    }

    function StyleBtn(btnRef){
        if(btnRef.current.textContent === "Editar"){
            btnRef.current.textContent = "Salvar"
        }else{
            btnRef.current.textContent = "Editar"
        }
    }

    function HandlerBtnValMinCPF(btnRef){
        StyleBtn(btnRef)
        if(!valMinCpfDesabled && valMinCpf !== ""){
            Api.put("parametro/VAL_MIN_CPF",{
                valor:valMinCpf
            }).then(response =>{
                if(response.status === 200){
                    alert("Paranmetro atualizado com sucesso")
                }
            }).catch(erro =>{
                alert("Erro ao atualizar o paranmetro:"+erro.message)
            })
        }
    }

    function HandlerBtnValLimItem(btnRef){
        StyleBtn(btnRef)
        if(!valLimItemDesabled && valLimItem !== ""){
            Api.put("parametro/LIMITE_ITEM",{
                valor:valLimItem
            }).then(response =>{
                if(response.status === 200){
                    alert("Paranmetro atualizado com sucesso")
                }
            }).catch(erro =>{
                alert("Erro ao atualizar o paranmetro"+erro.message)
            })
        }
    }

    function HandlerBtnValLimQntItem(btnRef){
        StyleBtn(btnRef)
        if(!valLimQntItemDesabled && valLimQntItem !== ""){
            Api.put("parametro/LIMITE_QNT_ITEM",{
                valor:valLimQntItem
            }).then(response =>{
                if(response.status === 200){
                    alert("Paranmetro atualizado com sucesso")
                }
            }).catch(erro =>{
                alert("Erro ao atualizar o paranmetro"+erro.message)
            })
        }
    }

    function HandlerBtnValMaxCar(btnRef){
        StyleBtn(btnRef)
        if(!valMaxCarDesabled && valMaxCar !== ""){
            Api.put("parametro/VAL_MAX_CAR",{
                valor:valMaxCar
            }).then(response =>{
                if(response.status === 200){
                    alert("Paranmetro atualizado com sucesso")
                }
            }).catch(erro =>{
                alert("Erro ao atualizar o paranmetro"+erro.message)
            })
        }
    }

    function HandlerBtnValMinFreteGratis(btnRef){
        StyleBtn(btnRef)
        if(!valMinFreteGratisDesabled && valMinFreteGratis !== ""){
            Api.put("parametro/VAL_MIN_FRETE",{
                valor:valMinFreteGratis
            }).then(response =>{
                if(response.status === 200){
                    alert("Paranmetro atualizado com sucesso")
                }
            }).catch(erro =>{
                alert("Erro ao atualizar o paranmetro"+erro.message)
            })
        }
    }

    function HandlerBtnValQntDecimal(btnRef){
        StyleBtn(btnRef)
        if(!valQntDecimalDesabled && valQntDecimal !== ""){
            Api.put("parametro/QNT_DECIMAL",{
                valor:valQntDecimal
            }).then(response =>{
                if(response.status === 200){
                    alert("Paranmetro atualizado com sucesso")
                }
            }).catch(erro =>{
                alert("Erro ao atualizar o paranmetro"+erro.message)
            })
        }
    }

    return (
        <div hidden={hidden}>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <p>
                            <strong>
                                Venda
                            </strong>
                        </p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body style={{padding:0}}>
                            <ItemConfig
                                disabled={switchWhatsAppDesabled}
                                titulo="Integração WhatsApp"
                                btnSwitch={true}
                                idSwitch="switchWhatsApp"
                                valueSwitch={switchWhatsApp}
                                onClickSwitch={HandlerSwitchWhatsApp}
                                info="Redirecionamento de Contato e envio do pedido formatado."
                            />
                            <ItemConfig
                                disabled={switchPedidoWhatsDetalhadoDesabled}
                                titulo="Pedido Detalhado ao WhatsApp"
                                btnSwitch={true}
                                idSwitch="switchPedidoWhatsDetalhado"
                                valueSwitch={switchPedidoWhatsDetalhado}
                                onClickSwitch={HandlerSwitchPedidoWhatsDetalhado}
                                info="Formatação do pedido de forma detalhada com itens e observações."
                            />
                            <ItemConfig
                                disabled={valQntDecimalDesabled}
                                titulo="Quantidade de Casas Decimais"
                                input={true}
                                valueInput={valQntDecimal}
                                onChangeInput={e => setValQntDecimal(e.target.value)}
                                onClickBtn={()=> {setValQntDecimalDesabled(!valQntDecimalDesabled); HandlerBtnValQntDecimal(valQntDecimalBtnRef)}}
                                btnRef={valQntDecimalBtnRef}
                                info="Quantidade de casas decimais permitidas para a digitação da quantidade fracionada."
                            />
                            <ItemConfig
                                disabled={valMinCpfDesabled}
                                titulo="Valor Minimo para CPF"
                                input={true}
                                valueInput={valMinCpf}
                                onChangeInput={e => setValMinCpf(e.target.value)}
                                onClickBtn={()=> {setValMinCpfDesabled(!valMinCpfDesabled); HandlerBtnValMinCPF(valMinCpfBtnRef)}}
                                btnRef={valMinCpfBtnRef}
                                info="Será solciitado o CPF na venda acima do valor informado."
                            />
                            <ItemConfig
                                disabled={valLimItemDesabled}
                                titulo="Limite de Itens"
                                input={true}
                                valueInput={valLimItem}
                                onChangeInput={e => setValLimItem(e.target.value)}
                                onClickBtn={()=> {setValLimItemDesabled(!valLimItemDesabled); HandlerBtnValLimItem(valLimItemBtnRef)}}
                                btnRef={valLimItemBtnRef}
                                info="Limite de itens por carrinho."
                            />
                            <ItemConfig
                                disabled={valLimQntItemDesabled}
                                titulo="Limite de Quantidade por Item"
                                input={true}
                                valueInput={valLimQntItem}
                                onChangeInput={e => setValLimQntItem(e.target.value)}
                                onClickBtn={()=> {setValLimQntItemDesabled(!valLimQntItemDesabled); HandlerBtnValLimQntItem(valLimQntItemBtnRef)}}
                                btnRef={valLimQntItemBtnRef}
                                info="Limite da quantidade por item para ser adicionado ao carrinho."
                            />
                            <ItemConfig
                                disabled={valMaxCarDesabled}
                                titulo="Valor Maximo por Carrinho"
                                input={true}
                                valueInput={valMaxCar}
                                onChangeInput={e => setValMaxCar(e.target.value)}
                                onClickBtn={()=> {setValMaxCarDesabled(!valMaxCarDesabled); HandlerBtnValMaxCar(valMaxCarBtnRef)}}
                                btnRef={valMaxCarBtnRef}
                                info="Valor total do carrinho para finalização da venda."
                            />
                            <ItemConfig
                                disabled={valMinFreteGratisDesabled}
                                titulo="Frete Gratis"
                                input={true}
                                valueInput={valMinFreteGratis}
                                onChangeInput={e => setValMinFreteGratis(e.target.value)}
                                onClickBtn={()=> {setValMinFreteDesabled(!valMinFreteGratisDesabled); HandlerBtnValMinFreteGratis(valMinFreteGratisBtnRef)}}
                                btnRef={valMinFreteGratisBtnRef}
                                info="Isenção do frete para venda superior ao valor informado."
                            />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <p>
                            <strong>
                                Impressão
                            </strong>
                        </p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body style={{padding:0}}>
                        <ItemConfig
                            disabled={switchCodProdImpDesabled}
                            titulo="Código do Produto na impressão do Pedido"
                            btnSwitch={true}
                            idSwitch="switchCodProdImp"
                            valueSwitch={switchCodProdImp}
                            onClickSwitch={HandlerSwitchCodProdImp}
                            info="Exibição do codigo de identificação do produto na impressão do pedido."
                        />
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}

export default JanelaConfig;